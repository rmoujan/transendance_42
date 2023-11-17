import { useAppSelector } from "../../redux/store/store";
import HeaderChannels from "./HeaderChannel";
import HeaderDM from "./HeaderDM";

const Header = () => {
  const { contact } = useAppSelector(state => state);

  return (
    <>
      {contact.type_chat === "individual" ? <HeaderDM /> : <HeaderChannels />}
    </>
  );
};

export default Header;
