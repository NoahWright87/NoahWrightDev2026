import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import FaIcon from "./FaIcon";

export default function EmailIcon({ size = 20, color = "currentColor" }) {
  return <FaIcon icon={faEnvelope} size={size} color={color} />;
}
