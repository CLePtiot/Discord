import React from 'react';
import { Check } from 'lucide-react';

const ToggleSwitch = ({ checked, onChange }) => {
    return (
        <div
            onClick={onChange}
            style={{
                width: '40px', height: '24px', borderRadius: '12px', flexShrink: 0,
                backgroundColor: checked ? 'var(--success-color)' : 'var(--bg-tertiary)',
                position: 'relative', cursor: 'pointer',
                transition: 'background-color 0.2s ease'
            }}
        >
            <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                backgroundColor: 'white',
                position: 'absolute', top: '2px',
                left: checked ? '18px' : '2px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease, background-color 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {checked && <Check size={14} color="var(--success-color)" strokeWidth={3} />}
            </div>
        </div>
    );
};

export default ToggleSwitch;
