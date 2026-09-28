import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import FaIcon from "./FaIcon";

// The official LinkedIn "in" mark, via Font Awesome's brand icons.
export default function LinkedInIcon({ size = 20, color = "currentColor" }) {
  return <FaIcon icon={faLinkedin} size={size} color={color} />;
}
