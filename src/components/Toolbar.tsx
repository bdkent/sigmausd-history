
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import React, { memo } from 'react';

import {  PickerProps } from '../types';
import { ColumnTypes, columns, columnTitles } from './columns';

type ToolbarProps = {
    pickerProps: PickerProps
    column: ColumnTypes;
    onColumnChange: (column: ColumnTypes) => void;
    onRangeChange: (dateRange?: [Date, Date]) => void;
};

export const Toolbar = memo((props: ToolbarProps) => {

    const { pickerProps, column, onColumnChange, onRangeChange } = props;

    return (
        <div className="d-flex flex-wrap">
            <div className="flex-fill">
                <DateRangePicker
                    {...pickerProps}
                    onChange={onRangeChange}
                    format="MMM d, y"
                />
            </div>
            <div className="flex-fill">
                <select value={column} className="form-select" onChange={(e) => {
                    onColumnChange(e.target.value as ColumnTypes)
                }}>
                    {columns.map(c => (<option key={c} value={c}>{columnTitles[c]}</option>))}
                </select>
            </div>
        </div>
    );
});
