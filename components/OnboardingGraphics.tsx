import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import tw from 'twrnc';
import { YaaluColors } from '@/constants/theme';

/** Step 1: Location Permission Graphic */
export function LocationGraphic() {
  return (
    <View style={tw`w-full h-44 bg-slate-50 rounded-2xl items-center justify-center my-3 overflow-hidden`}>
      <View style={tw`w-48 h-36 bg-white rounded-2xl border border-slate-200 overflow-hidden relative items-center justify-center`}>
        {/* Map lines pattern */}
        <View style={tw`w-full h-full bg-slate-100 absolute`}>
          <View style={tw`absolute top-5 w-full h-1.5 bg-slate-200`} />
          <View style={tw`absolute left-10 w-1.5 h-full bg-slate-200`} />
          <View style={tw`absolute top-16 left-5 w-28 h-1.5 bg-slate-200 -rotate-12`} />
          <Ionicons name="location" size={36} color="#1D4ED8" style={tw`absolute top-6 left-20`} />
        </View>

        {/* Permission Popup Dialog */}
        <View style={tw`w-10/12 bg-white rounded-xl p-3 items-center shadow-md`}>
          <Text style={tw`text-[10px] font-bold text-slate-800 text-center leading-3`}>
            Allow "Yaalu Rider" to access this device's location?
          </Text>
          <View style={tw`h-px w-full bg-slate-200 my-2`} />
          <Text style={tw`text-xs font-extrabold text-blue-600`}>Allow</Text>
        </View>
      </View>
    </View>
  );
}

/** Step 2: Notifications Graphic */
export function NotificationsGraphic() {
  return (
    <View style={tw`w-full h-40 bg-slate-50 rounded-2xl items-center justify-center my-3 overflow-hidden relative`}>
      <View style={tw`absolute w-52 h-12 bg-white rounded-xl p-2.5 shadow-sm border border-slate-100 top-2 scale-90`}>
        <View style={tw`w-10 h-1.5 bg-slate-300 rounded mb-1.5`} />
        <View style={tw`w-28 h-1.5 bg-slate-200 rounded`} />
      </View>
      <View style={tw`absolute w-52 h-12 bg-white rounded-xl p-2.5 shadow-sm border border-slate-100 top-6 scale-95`}>
        <View style={tw`w-10 h-1.5 bg-slate-300 rounded mb-1.5`} />
        <View style={tw`w-28 h-1.5 bg-slate-200 rounded`} />
      </View>

      {/* Bell Icon */}
      <View style={tw`relative mt-2`}>
        <FontAwesome5 name="bell" size={60} color="#F59E0B" solid />
        <View style={tw`absolute -top-1 -right-1 bg-blue-800 w-6 h-6 rounded-full items-center justify-center border-2 border-white`}>
          <Text style={tw`text-white text-xs font-extrabold`}>1</Text>
        </View>
      </View>
    </View>
  );
}

/** Step 3: Dashboard Preview Graphic */
export function DashboardGraphic() {
  return (
    <View style={tw`w-full rounded-2xl overflow-hidden my-2`}>
      <View style={tw`bg-[#0B1044] rounded-2xl p-3.5`}>
        <Text style={tw`text-[9px] font-bold text-slate-400 tracking-wider`}>TODAY'S EARNINGS</Text>
        <Text style={tw`text-xl font-black text-white my-1`}>LKR 4,320.00</Text>
        <View style={tw`flex-row gap-2 mt-1.5`}>
          <View style={tw`flex-1 bg-white/10 rounded-lg p-2`}>
            <Text style={tw`text-[9px] text-slate-300`}>Deliveries</Text>
            <Text style={tw`text-xs font-bold text-white mt-0.5`}>18</Text>
          </View>
          <View style={tw`flex-1 bg-white/10 rounded-lg p-2`}>
            <Text style={tw`text-[9px] text-slate-300`}>Active Hours</Text>
            <Text style={tw`text-xs font-bold text-white mt-0.5`}>6h 30m</Text>
          </View>
        </View>
      </View>

      <View style={tw`bg-white rounded-xl p-3 mt-2 border border-slate-200`}>
        <View style={tw`flex-row justify-between mb-1`}>
          <Text style={tw`text-[8px] font-extrabold text-emerald-500`}>IN PROGRESS</Text>
          <Text style={tw`text-[8px] text-slate-400`}>Order #3714-4507</Text>
        </View>
        <Text style={tw`text-sm font-extrabold text-slate-900`}>Flourberry Bakery</Text>
        <Text style={tw`text-[10px] text-slate-500 mt-0.5`}>
          3.2 km • 12 mins • <Text style={tw`text-emerald-600 font-bold`}>LKR 280.00</Text>
        </Text>
        <View style={tw`bg-[#0B1044] rounded-lg py-1.5 items-center mt-2`}>
          <Text style={tw`text-white text-xs font-bold`}>Accept</Text>
        </View>
      </View>
    </View>
  );
}

/** Step 4: Go Online Screen Graphic */
export function GoOnlineGraphic() {
  return (
    <View style={tw`w-full h-64 bg-white rounded-3xl border-2 border-slate-200 overflow-hidden my-3 shadow-md`}>
      <View style={tw`h-7 px-4 flex-row justify-between items-center bg-slate-50 border-b border-slate-100`}>
        <Text style={tw`text-[10px] font-bold text-slate-600`}>9:41</Text>
        <View style={tw`flex-row gap-1`}>
          <Ionicons name="wifi" size={14} color="#64748B" />
          <Ionicons name="battery-charging" size={14} color="#64748B" />
        </View>
      </View>

      <View style={tw`flex-1 bg-blue-50 p-3 justify-between items-center`}>
        <View style={tw`w-full bg-white rounded-xl py-2.5 px-3.5 flex-row justify-between items-center shadow-sm`}>
          <Text style={tw`text-xs font-bold text-slate-800`}>You are Offline</Text>
          <View style={tw`w-9 h-5 rounded-full bg-slate-300 p-0.5 justify-center`}>
            <View style={tw`w-4 h-4 rounded-full bg-white`} />
          </View>
        </View>

        <View style={tw`w-11 h-11 rounded-full bg-blue-500/20 items-center justify-center`}>
          <View style={tw`w-4 h-4 rounded-full bg-blue-600 border-2 border-white`} />
        </View>

        <View style={tw`w-full bg-white rounded-xl py-3 px-3.5 flex-row justify-between items-center shadow-sm`}>
          <Text style={tw`text-[10px] font-semibold text-slate-700 flex-1 pr-2`}>
            Go Online to receive delivery requests
          </Text>
          <View style={tw`w-11 h-6 rounded-full bg-emerald-500 p-0.5 justify-center items-end`}>
            <View style={tw`w-5 h-5 rounded-full bg-white`} />
          </View>
        </View>
      </View>
    </View>
  );
}

/** Step 5: Accept Order Request Graphic */
export function AcceptOrderGraphic() {
  return (
    <View style={tw`w-full bg-[#F0F4FE] rounded-2xl p-4 my-3 items-center`}>
      <View style={tw`w-4/5 h-12 flex-row items-center justify-between my-2`}>
        <View style={tw`w-3 h-3 rounded-full bg-emerald-500`} />
        <View style={tw`flex-1 h-0.5 border-dashed border border-blue-600 mx-2`} />
        <View style={tw`w-3 h-3 rounded-full bg-red-500`} />
      </View>

      <View style={tw`w-full bg-white rounded-2xl p-4 shadow-md`}>
        <Text style={tw`text-[9px] font-extrabold text-slate-500 tracking-wider mb-1`}>NEW DELIVERY REQUEST</Text>
        <Text style={tw`text-base font-extrabold text-slate-900`}>Fish Mart – Negombo</Text>
        <Text style={tw`text-xs text-slate-500 mt-0.5`}>2.4 km away • 12 min</Text>
        
        <Text style={tw`text-lg font-black text-[#0B1044] mt-3`}>LKR 320.00</Text>
        <Text style={tw`text-[9px] text-slate-400`}>Estimated Earnings</Text>

        <View style={tw`flex-row gap-2.5 mt-3.5`}>
          <View style={tw`flex-1 py-2.5 rounded-xl bg-slate-100 items-center`}>
            <Text style={tw`text-xs font-bold text-slate-600`}>Decline</Text>
          </View>
          <View style={tw`flex-1 py-2.5 rounded-xl bg-[#0B1044] items-center`}>
            <Text style={tw`text-xs font-bold text-white`}>Accept</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/** Step 6: Navigate to Pickup Graphic */
export function NavigatePickupGraphic() {
  return (
    <View style={tw`w-full rounded-2xl overflow-hidden my-3 shadow-md border border-slate-200`}>
      <Image
        source={require('@/assets/images/navigate-pickup.png')}
        style={tw`w-full h-64`}
        resizeMode="contain"
      />
    </View>
  );
}

/** Step 7: Deliver & Complete Graphic */
export function DeliverCompleteGraphic() {
  return (
    <View style={tw`w-full rounded-2xl overflow-hidden my-3`}>
      {/* Rider & Customer Handover Image */}
      <View style={tw`w-full h-48 bg-slate-50 rounded-2xl overflow-hidden items-center justify-center`}>
        <Image
          source={require('@/assets/images/deliver-complete.png')}
          style={tw`w-full h-full`}
          resizeMode="contain"
        />
      </View>

      {/* Timeline Status Checklist */}
      <View style={tw`bg-white rounded-2xl p-4 mt-3 border border-slate-100 shadow-sm gap-3`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center gap-2.5`}>
            <View style={tw`w-6 h-6 rounded-full bg-emerald-500 items-center justify-center`}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
            <Text style={tw`text-sm font-bold text-slate-800`}>Picked Up</Text>
          </View>
          <Text style={tw`text-xs font-medium text-slate-400`}>10:10 AM</Text>
        </View>

        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center gap-2.5`}>
            <View style={tw`w-6 h-6 rounded-full bg-emerald-500 items-center justify-center`}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
            <Text style={tw`text-sm font-bold text-slate-800`}>On The Way</Text>
          </View>
          <Text style={tw`text-xs font-medium text-slate-400`}>10:20 AM</Text>
        </View>

        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center gap-2.5`}>
            <View style={tw`w-6 h-6 rounded-full bg-emerald-500 items-center justify-center`}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
            <Text style={tw`text-sm font-bold text-slate-800`}>Arrived at Location</Text>
          </View>
          <Text style={tw`text-xs font-medium text-slate-400`}>10:32 AM</Text>
        </View>

        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center gap-2.5`}>
            <View style={tw`w-6 h-6 rounded-full bg-emerald-500 items-center justify-center`}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
            <Text style={tw`text-sm font-extrabold text-emerald-600`}>Delivered</Text>
          </View>
          <Text style={tw`text-xs font-bold text-emerald-600`}>10:35 AM</Text>
        </View>
      </View>
    </View>
  );
}
