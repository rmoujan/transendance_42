import { useAppSelector } from '../../redux/store/store';
import Maincontent from './Maincontent';

function LandingPage() {
  const {profile} = useAppSelector((state) => state)
  return (
    <>
      {console.log(profile)}
      <Maincontent />
    </>
  )
}

export default LandingPage