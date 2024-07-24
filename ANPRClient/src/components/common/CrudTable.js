import React from 'react';
import { MdDelete ,MdEdit ,MdAdd } from "react-icons/md";
import { DetectorMenu } from '../crud/DetectorMenu';
import { useCameras } from '../../contexts/CameraContext';

const CrudTable = ({ data, columns, onAdd, onEdit, onRemove, showDropUp, onSelectType ,onOutsideClick}) => {
    const {cameras} = useCameras();
    const renderCellContent = (item, column, index ) => {
        if (column.key === 'active') {
            return <input type="checkbox" checked={item[column.key]}  readOnly/>;
        }
        if (column.key === 'id'){
            return index + 1 ;
        }
        if(column.key ==='cameraId'){
            const camera = cameras.find(cam => cam.id === item[column.key]);
            return camera ? camera.label : 'Camera not found';
        }
        return item[column.key];
    };
    return (
        <div>
           
            <div className='add'>
                <button onClick={onAdd}>
                    <MdAdd className='add-icon' />
                </button>
                {showDropUp && <DetectorMenu onSelect={onSelectType} onOutsideClick={onOutsideClick}/>}
            </div>
            <div className='table-container'>

                <table>
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>{column.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                {columns.map((column) => (
                                    <td key={column.key}>{renderCellContent(item,column,index)}</td>
                                ))}
                                <td className="action-column">
                                    <button onClick={() => onEdit(item)}>
                                        <MdEdit className='icon' />
                                    </button>
                                </td>
                                <td className="action-column">
                                    <button onClick={() => onRemove(item.id)}>
                                        <MdDelete className='icon' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
           
        </div>
    );
};

export default CrudTable;
