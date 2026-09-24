/**
 * useHireNotification
 * -------------------
 * Real-time hire request notification hook for the Yaalu Rider App.
 *
 * Strategy:
 *   1. Primary: Socket.io WebSocket connection to /rides namespace
 *   2. Fallback: 10-second polling via REST API (getAvailableRides)
 *
 * Usage:
 *   const { hasNewHireRequest, latestRequest, dismissNotification } = useHireNotification();
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { getBaseUrl, getToken } from '@/services/api';
import riderApi from '@/services/api';

export interface HireRequestNotification {
  id: string;
  type: 'NEW_HIRE_REQUEST';
  title: string;
  body: string;
  rideRequest: {
    id: string;
    pickupAddress: string;
    dropoffAddress: string;
    rideType: string;
    selectedVehicleType?: string;
    finalFare?: number;
    createdAt?: string;
  };
  timestamp: string;
}

interface UseHireNotificationReturn {
  /** true when there's an unread hire request */
  hasNewHireRequest: boolean;
  /** the most recent unread hire notification */
  latestRequest: HireRequestNotification | null;
  /** total count of available rides (for badge) */
  availableCount: number;
  /** call this to dismiss the notification banner */
  dismissNotification: () => void;
  /** manually trigger a refresh */
  refresh: () => void;
  /** whether the socket is connected */
  socketConnected: boolean;
}

// Track seen ride IDs to avoid duplicate notifications
const seenRideIds = new Set<string>();

export function useHireNotification(isOnline: boolean = true): UseHireNotificationReturn {
  const [hasNewHireRequest, setHasNewHireRequest] = useState(false);
  const [latestRequest, setLatestRequest] = useState<HireRequestNotification | null>(null);
  const [availableCount, setAvailableCount] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);

  const socketRef = useRef<any>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const socketFailedRef = useRef(false);

  const dismissNotification = useCallback(() => {
    setHasNewHireRequest(false);
    setLatestRequest(null);
  }, []);

  const handleNewRide = useCallback((rideData: any) => {
    const rideId = rideData?.rideRequest?.id || rideData?.id;
    if (!rideId || seenRideIds.has(rideId)) return;
    seenRideIds.add(rideId);

    const notification: HireRequestNotification = {
      id: rideId,
      type: 'NEW_HIRE_REQUEST',
      title: rideData?.title || 'New Hire Request! 🚗',
      body: rideData?.body || `${rideData?.rideRequest?.pickupAddress || ''} → ${rideData?.rideRequest?.dropoffAddress || ''}`,
      rideRequest: rideData?.rideRequest || rideData,
      timestamp: rideData?.timestamp || new Date().toISOString(),
    };

    setLatestRequest(notification);
    setHasNewHireRequest(true);
    setAvailableCount((prev) => prev + 1);
  }, []);

  // ─── REST Polling Fallback (every 10 seconds) ────────────────
  const pollAvailableRides = useCallback(async () => {
    if (!isOnline) return;
    try {
      const rides: any[] = await riderApi.getAvailableRides() as any;
      if (!Array.isArray(rides)) return;

      setAvailableCount(rides.length);

      for (const ride of rides) {
        if (!seenRideIds.has(ride.id)) {
          handleNewRide({
            rideRequest: ride,
            title: '🚗 New Hire Request!',
            body: `${ride.pickupAddress} → ${ride.dropoffAddress}`,
            timestamp: ride.createdAt || new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      // Silent — polling is a background operation
    }
  }, [isOnline, handleNewRide]);

  const refresh = useCallback(() => {
    pollAvailableRides();
  }, [pollAvailableRides]);

  // ─── Socket.io Connection ────────────────────────────────────
  const connectSocket = useCallback(async () => {
    if (socketRef.current || socketFailedRef.current) return;

    try {
      // Dynamic import to avoid crashing if not installed yet
      const { io } = await import('socket.io-client');
      const baseUrl = getBaseUrl();
      const token = await getToken();

      const socket = io(`${baseUrl}/rides`, {
        transports: ['websocket', 'polling'],
        auth: token ? { token } : undefined,
        reconnection: true,
        reconnectionDelay: 3000,
        reconnectionAttempts: 5,
        timeout: 5000,
      });

      socket.on('connect', () => {
        setSocketConnected(true);
        socketFailedRef.current = false;
        // Stop polling since socket is live
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      });

      socket.on('disconnect', () => {
        setSocketConnected(false);
        // Restart polling as fallback
        startPolling();
      });

      socket.on('connect_error', () => {
        socketFailedRef.current = true;
        setSocketConnected(false);
        startPolling();
      });

      // 🔔 Main event: new hire request from customer
      socket.on('new_hire_request', (data: any) => {
        handleNewRide(data);
      });

      socketRef.current = socket;
    } catch (err) {
      // socket.io-client not available or network error — fall back to polling
      socketFailedRef.current = true;
      startPolling();
    }
  }, [handleNewRide]);

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return; // already polling
    pollAvailableRides(); // immediate first poll
    pollingIntervalRef.current = setInterval(pollAvailableRides, 10_000);
  }, [pollAvailableRides]);

  useEffect(() => {
    if (!isOnline) {
      // Clean up when rider goes offline
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setSocketConnected(false);
      setAvailableCount(0);
      return;
    }

    connectSocket();
    // Always start polling as a safety net (socket disables it on connect)
    startPolling();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isOnline, connectSocket, startPolling]);

  return {
    hasNewHireRequest,
    latestRequest,
    availableCount,
    dismissNotification,
    refresh,
    socketConnected,
  };
}
