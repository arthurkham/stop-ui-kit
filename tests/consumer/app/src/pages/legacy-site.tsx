// An existing site: Bootstrap 3 and the site's own global CSS, both untouched.
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/legacy-site.css';
import '@stop-ui/react/styles.css';
import '../styles/scale.css';
import { Kitchen, mount } from '../kitchen';

mount(<Kitchen />);
