import { FetchCharacters } from '../../redux/slices/anime';
import { FetchProfile } from '../../redux/slices/profile';
import { useAppDispatch } from '../../redux/store/store';
import Maincontent from './Maincontent';
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