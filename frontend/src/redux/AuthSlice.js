import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name:"auth",
  initialState:{
    user:null,
    isAuthenticated:false,
  },
  reducers:{
    setAuthUser:(state,action)=>{
      state.user=action.payload;
      state.isAuthenticated=true;
    }

}

});

export const {setAuthUser} = authSlice.actions;
export default authSlice.reducer;