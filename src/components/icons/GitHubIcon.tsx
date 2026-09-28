import { faGithub } from "@fortawesome/free-brands-svg-icons";
import FaIcon from "./FaIcon";

// The official GitHub mark, via Font Awesome's brand icons.
export default function GitHubIcon({ size = 20, color = "currentColor" }) {
  return <FaIcon icon={faGithub} size={size} color={color} />;
}
