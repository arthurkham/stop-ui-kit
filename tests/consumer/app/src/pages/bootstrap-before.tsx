// One stylesheet with a fixed import order.
import '../styles/bootstrap-before.css';
import { Kitchen, mount } from '../kitchen';

mount(<Kitchen />);
