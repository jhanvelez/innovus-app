import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Meter } from '@/types/Meter';

interface MeterState {
  meters: Meter[]
}

const initialState: MeterState = {
  meters: [],
}

const meterSlice = createSlice({
  name: 'meter',
  initialState,
  reducers: {
    setMeters: (state, action: PayloadAction<Meter[]>) => {
      state.meters = action.payload;
    },
    addMeter: (state, action: PayloadAction<Meter>) => {
      state.meters.push(action.payload);
    },
    removeMeter: (state, action: PayloadAction<string>) => {
      state.meters = state.meters.filter(meter => meter.id !== action.payload);
    },
  },
});

export const { setMeters, addMeter, removeMeter } = meterSlice.actions;
export default meterSlice.reducer;

export const selectMeters = (state: { meter: MeterState }) => state.meter.meters;
export const selectMeterById = (state: { meter: MeterState }, id: string) =>
  state.meter.meters.find(meter => meter.id === id);
export const selectMeterCount = (state: { meter: MeterState }) => state.meter.meters.length;

export const meterReducer = meterSlice.reducer;

// Export the actions for use in components
export const meterActions = {
  setMeters,
  addMeter,
  removeMeter,
};

// Export the selectors for use in components
export const meterSelectors = {
  selectMeters,
  selectMeterById,
  selectMeterCount,
};