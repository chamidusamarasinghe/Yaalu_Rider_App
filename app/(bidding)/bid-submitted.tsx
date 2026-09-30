import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import tw from '@/lib/tw';

export default function BidSubmittedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const myBid = params.bid ? Number(params.bid) : 980;
  const startingPrice = params.startingPrice ? Number(params.startingPrice) : 1000;
  const minBid = params.minBid ? Number(params.minBid) : 900;
  const maxBid = params.maxBid ? Number(params.maxBid) : 1200;

  const [driversCount, setDriversCount] = useState(1);
  const [myRank, setMyRank] = useState<number>(1);
  const [riderId, setRiderId] = useState<string>('');

  const [secondsLeft, setSecondsLeft] = useState(
    params.secondsLeft ? Number(params.secondsLeft) : 105
  );

  useEffect(() => {
    import('@/services/api').then(m => m.getSavedRider()).then(r => {
      if (r) setRiderId(r.id);
    });
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    const rideRequestId = params.rideRequestId as string;
    if (!rideRequestId) return;

    const interval = setInterval(async () => {
      try {
        const { riderApi } = await import('@/services/api');
        const details = await riderApi.getRideDetails(rideRequestId);
        
        if (details.bids && Array.isArray(details.bids)) {
          setDriversCount(details.bids.length);
          
          // Sort bids ascending
          const sortedBids = [...details.bids].sort((a, b) => a.proposedFare - b.proposedFare);
          
          if (riderId) {
            const myRankIndex = sortedBids.findIndex(b => b.driverId === riderId);
            if (myRankIndex !== -1) {
              setMyRank(myRankIndex + 1);
            }
          }
        }

        if (details.status === 'ACCEPTED') {
          clearInterval(interval);
          if (details.acceptedDriverId === riderId) {
            router.push({ pathname: '/bid-won', params: { rideRequestId, bid: myBid.toString(), finalFare: details.finalFare?.toString() } } as any);
          } else {
            router.push('/bid-lost' as any);
          }
        }
      } catch (e) {
        // Silent polling fail
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [params.rideRequestId, riderId]);

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const ss = (secondsLeft % 60).toString().padStart(2, '0');

  const handleChangeBid = () => {
    router.push({
      pathname: '/place-bid',
      params: {
        startingPrice: startingPrice.toString(),
        minBid: minBid.toString(),
        maxBid: maxBid.toString(),
        secondsLeft: secondsLeft.toString(),
      },
    } as any);
  };

  const handleHireDetails = () => {
    router.push({
      pathname: '/hire-details',
      params: {
        startingPrice: startingPrice.toString(),
        minBid: minBid.toString(),
        maxBid: maxBid.toString(),
        secondsLeft: secondsLeft.toString(),
      },
    } as any);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      {/* Top Header */}
      <View style={tw`px-4 py-3 flex-row items-center justify-between bg-[#FFC72C] shadow-sm`}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={tw`p-2 bg-white/40 rounded-full`}>
          <Ionicons name="home-outline" size={20} color="#0B1044" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-black text-[#0B1044]`}>Bid Submitted</Text>
        <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={tw`p-2 bg-white/40 rounded-full`}>
          <Feather name="bell" size={18} color="#0B1044" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={tw`px-5 pb-10 pt-3`}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Success Card */}
        <View style={tw`bg-white rounded-3xl p-6 items-center shadow-md border border-slate-100 mb-4`}>
          {/* Green check */}
          <View style={tw`w-16 h-16 rounded-full bg-emerald-500 items-center justify-center mb-3 shadow-lg`}>
            <Ionicons name="checkmark" size={34} color="#fff" />
          </View>

          <Text style={tw`text-3xl font-extrabold text-slate-900 mb-1`}>
            Rs. {myBid.toLocaleString()}
          </Text>
          <Text style={tw`text-xs font-semibold text-slate-400 mb-4`}>Your Current Bid</Text>

          <View style={tw`h-[1px] bg-slate-100 w-full mb-3`} />

          <View style={tw`flex-row justify-between w-full`}>
            <View>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Starting Price:</Text>
              <Text style={tw`text-xs font-extrabold text-slate-900`}>Rs. {startingPrice.toLocaleString()}</Text>
            </View>
            <View style={tw`items-end`}>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Allowed Range:</Text>
              <Text style={tw`text-xs font-extrabold text-slate-900`}>
                Rs. {minBid.toLocaleString()} – Rs. {maxBid.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Live Running Timer + Drivers Card */}
        <View style={tw`bg-white rounded-3xl p-5 flex-row justify-between items-center shadow-sm border border-slate-100 mb-4`}>
          <View style={tw`flex-row items-center`}>
            <View style={[
              tw`w-12 h-12 rounded-2xl items-center justify-center mr-3`,
              secondsLeft < 30 ? tw`bg-red-50 border border-red-200` : tw`bg-amber-50 border border-amber-200`,
            ]}>
              <Feather name="clock" size={20} color={secondsLeft < 30 ? '#DC2626' : '#D97706'} />
            </View>
            <View>
              <Text style={[tw`text-2xl font-black`, secondsLeft < 30 ? tw`text-red-600` : tw`text-slate-900`]}>
                {mm}:{ss}
              </Text>
              <Text style={[tw`text-[10px] font-bold uppercase`, secondsLeft < 30 ? tw`text-red-500` : tw`text-slate-400`]}>
                {secondsLeft > 0 ? 'Remaining Time' : 'Bidding Ended'}
              </Text>
            </View>
          </View>

          <View style={tw`items-center`}>
            {/* Dynamic Driver avatars representation */}
            <View style={tw`flex-row mb-1`}>
              {Array.from({ length: Math.min(driversCount, 4) }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    tw`w-6 h-6 rounded-full border-2 border-white items-center justify-center bg-slate-400`,
                    { marginLeft: i === 0 ? 0 : -6 },
                  ]}
                >
                  <Ionicons name="person" size={12} color="#fff" />
                </View>
              ))}
              {driversCount > 4 && (
                <View style={[tw`w-6 h-6 rounded-full border-2 border-white items-center justify-center bg-slate-300`, { marginLeft: -6 }]}>
                  <Text style={tw`text-[9px] font-bold text-slate-700`}>+{driversCount - 4}</Text>
                </View>
              )}
            </View>
            <Text style={tw`text-sm font-extrabold text-slate-900`}>{driversCount} Drivers</Text>
            <Text style={tw`text-[10px] font-semibold text-slate-400`}>Currently Bidding</Text>
          </View>
        </View>

        {/* Position Podium Card */}
        <View style={tw`bg-[#0B1044] rounded-3xl p-5 mb-4 overflow-hidden`}>
          <View style={tw`flex-row justify-between items-center mb-1`}>
            <Text style={tw`text-slate-400 text-xs font-bold uppercase`}>Your Position</Text>
            <View style={tw`bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 rounded-full`}>
              <Text style={tw`text-[10px] font-black text-emerald-300`}>COMPETITIVE BID</Text>
            </View>
          </View>
          <Text style={tw`text-3xl font-extrabold text-white mb-4`}>
            {myRank === 1 ? '1st Place' : myRank === 2 ? '2nd Place' : myRank === 3 ? '3rd Place' : `${myRank}th Place`}
          </Text>

          {/* Podium Visual */}
          <View style={tw`flex-row items-end justify-center`}>
            {/* 2nd place */}
            <View style={[tw`items-center mr-2 opacity-50`, myRank === 2 && tw`opacity-100`]}>
              <View style={[tw`w-11 h-11 rounded-full items-center justify-center mb-2 shadow-lg`, myRank === 2 ? tw`bg-emerald-500 border-4 border-emerald-400` : tw`bg-[#FFC72C] border-4 border-[#FFC72C]`]}>
                <Ionicons name="person" size={20} color={myRank === 2 ? '#fff' : '#0B1044'} />
              </View>
              <View style={[tw`w-16 h-14 rounded-t-xl items-center justify-center border-2`, myRank === 2 ? tw`bg-emerald-500/20 border-emerald-500` : tw`bg-[#FFC72C]/20 border-[#FFC72C]`]}>
                <Text style={[tw`font-extrabold text-xl`, myRank === 2 ? tw`text-emerald-500` : tw`text-[#FFC72C]`]}>2</Text>
              </View>
            </View>

            {/* 1st place - tallest */}
            <View style={[tw`items-center mx-2 opacity-50`, myRank === 1 && tw`opacity-100`]}>
              <View style={[tw`w-11 h-11 rounded-full items-center justify-center mb-2`, myRank === 1 ? tw`bg-emerald-500 border-4 border-emerald-400` : tw`bg-slate-500 border-2 border-slate-400`]}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
              <View style={[tw`w-16 h-20 rounded-t-xl items-center justify-center`, myRank === 1 ? tw`bg-emerald-600 border-2 border-emerald-500` : tw`bg-slate-600`]}>
                <Text style={tw`text-white font-extrabold text-xl`}>1</Text>
              </View>
            </View>

            {/* 3rd place */}
            <View style={[tw`items-center ml-2 opacity-50`, myRank === 3 && tw`opacity-100`]}>
              <View style={[tw`w-11 h-11 rounded-full items-center justify-center mb-2`, myRank === 3 ? tw`bg-emerald-500 border-4 border-emerald-400` : tw`bg-orange-400 border-2 border-orange-300`]}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
              <View style={[tw`w-16 h-10 rounded-t-xl items-center justify-center border`, myRank === 3 ? tw`bg-emerald-500/20 border-emerald-500` : tw`bg-orange-500/20 border-orange-400`]}>
                <Text style={[tw`font-extrabold text-xl`, myRank === 3 ? tw`text-emerald-500` : tw`text-orange-400`]}>3</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={tw`flex-row gap-3 mb-3`}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleChangeBid}
            style={tw`flex-1 py-3.5 rounded-2xl bg-white border-2 border-slate-900 items-center justify-center shadow-sm`}
          >
            <Text style={tw`text-sm font-extrabold text-slate-900`}>Change Bid</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleHireDetails}
            style={tw`flex-1 py-3.5 rounded-2xl border-2 border-slate-900 items-center justify-center bg-slate-900 shadow-sm`}
          >
            <Text style={tw`text-sm font-extrabold text-white`}>Hire Details</Text>
          </TouchableOpacity>
        </View>



        <Text style={tw`text-[11px] text-slate-400 text-center leading-5 px-4`}>
          Your bid remains live until the countdown ends. The lowest valid bid wins the ride.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

