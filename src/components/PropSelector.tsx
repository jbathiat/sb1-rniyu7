import React from 'react';
import { useAdminStore } from '../store/adminStore';
import { PropItem } from '../types';

interface PropSelectorProps {
  onSelectProp: (prop: PropItem) => void;
}

const PropSelector: React.FC<PropSelectorProps> = ({ onSelectProp }) => {
  const settings = useAdminStore((state) => state.settings);

  if (!settings.props?.enabled || !settings.props?.items?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Virtual Props</h3>
      <div className="grid grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
        {settings.props.items.map((prop) => (
          <button
            key={prop.id}
            onClick={() => onSelectProp(prop)}
            className="p-2 border rounded-lg hover:border-pink-500 transition-colors"
          >
            <img
              src={prop.url}
              alt={prop.name}
              className="w-full h-20 object-contain"
            />
            <span className="text-sm truncate block mt-1">{prop.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropSelector;