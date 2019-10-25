import React from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

function BasicDatePicker(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        label={props.label}
        value={props.value}
        onChange={e => props.onChange(e, props.name)}
        animateYearScrolling
        fullWidth
        disabled={props.disabled}
        margin={props.margin}
      />
    </MuiPickersUtilsProvider>
  );
}
export default BasicDatePicker;
