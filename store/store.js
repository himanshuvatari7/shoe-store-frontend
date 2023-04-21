import { configureStore } from '@reduxjs/toolkit'

import cartSlice from './cartSlice'

export default configureStore({
  reducer: {
    cart: cartSlice,
  },
})

//useDispatch   (to use actions)
//useSelector   (to use store values)