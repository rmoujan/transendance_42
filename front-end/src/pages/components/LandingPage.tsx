import React from 'react'
import Maincontent from './Maincontent'
import { useAppDispatch } from '../../redux/store/store';
import { FetchProfile } from '../../redux/slices/profile';
function LandingPage() {
  const dispatch = useAppDispatch();
  dispatch(FetchProfile())
  return (
    <>
      <Maincontent />
    </>
  )
}

export default LandingPage