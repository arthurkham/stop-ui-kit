// Bootstrap loaded as existing sites do: unlayered, untouched. The bundler decides the order.
import 'bootstrap/dist/css/bootstrap.css';
import '@stop-ui/react/styles.css';
import '../styles/scale.css';
import { Kitchen, mount } from '../kitchen';

mount(<Kitchen />);
