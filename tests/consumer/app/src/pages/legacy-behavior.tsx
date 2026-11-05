// Existing scripts and utility classes keep working on kit components.
import 'bootstrap/dist/css/bootstrap.css';
import '@stop-ui/react/styles.css';
import '../styles/scale.css';
import { Button, Input } from '@stop-ui/react';
import { mount } from '../kitchen';

mount(
  <main style={{ padding: 16 }}>
    <Button className="hidden" data-expect="display: none">
      Bootstrap .hidden
    </Button>
    {/* jQuery's .hide() sets an inline style. */}
    <Button style={{ display: 'none' }} data-expect="display: none">
      jQuery hide
    </Button>
    <Button className="pull-right" data-expect="float: right">
      Bootstrap .pull-right
    </Button>
    <Input aria-label="Bootstrap .hide" className="hide" data-expect="display: none" />
  </main>,
);
