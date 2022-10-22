import logo from "../assets/logo.svg";
import logoTransparent from "../assets/logo_transparent.svg";

const Logo = ({ transparent, width, height, className }) => {
  return transparent ? ( // transparent background or normal
    <img
      src={logoTransparent}
      alt='Logo Transparent'
      height={height}
      width={width}
      style={{ aspectRatio: 1 / 1 }}
      className={className}
    />
  ) : (
    <img
      src={logo}
      alt='Logo'
      width={width}
      height={height}
      style={{ aspectRatio: 1 / 1 }}
      className={className}
    />
  );
};

export default Logo;
