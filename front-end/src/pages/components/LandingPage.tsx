import React from 'react'
import Maincontent from './Maincontent'
import { useAppDispatch } from '../../redux/store/store';
import { FetchProfile } from '../../redux/slices/profile';
import { FetchCharacters } from '../../redux/slices/anime';
function LandingPage() {
  const dispatch = useAppDispatch();
  dispatch(FetchProfile())
  dispatch(FetchCharacters());
  return (
    <>
      <Maincontent />
    </>
  )
}

export default LandingPage