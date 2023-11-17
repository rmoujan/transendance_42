import PropTypes from "prop-types";
//
import Image from "../../Image";

// ----------------------------------------------------------------------

AvatarPreview.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default function AvatarPreview({ file }: any) {
  if (!file) {
    return null;
  }

  const imgUrl = typeof file === "string" ? file : file.preview;

  return (
    <Image
      alt="avatar"
      src={imgUrl}
      sx={{
        zIndex: 8,
        overflow: "hidden",
        borderRadius: "50%",
        position: "absolute",
        width: `calc(100%)`,
        height: `calc(100%)`,
      }}
    />
  );
}
