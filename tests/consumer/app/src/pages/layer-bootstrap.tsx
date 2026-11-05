// The layered stylesheet needs Bootstrap in the base layer.
import '@stop-ui/react/styles.layer.css';
import '../styles/bootstrap-base-layer.css';
import { Kitchen, mount } from '../kitchen';

mount(<Kitchen />);
