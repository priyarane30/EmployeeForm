import { createFieldClass, controls } from 'react-redux-form';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

const FabricField = createFieldClass(
  {
    'Dropdown': controls.select
  },
  {
    componentMap:
    {
      Dropdown: Dropdown
    }
  });

export default FabricField;