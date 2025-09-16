import React, { useState, useEffect } from 'react';

export interface ConditionOption {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sku: string;
  active?: boolean;
}

const ConditionsEditPage = ({
  conditions,
  onBack,
  updateCondition,
  addCondition,
  deleteCondition,
  onNavigationChange,
  networkInfo,
  initialConditionId,
  editorOnly
}) => {
  const [editingConditionId, setEditingConditionId] = useState(null);
  const [priceInputs, setPriceInputs] = useState({});

  // Initialize price inputs only for new conditions or on first load
  useEffect(() => {
    const initialPrices = { ...priceInputs };
    conditions.forEach(condition => {
      // Only set initial value if we don't already have one for this condition
      if (!(condition.id in initialPrices)) {
        initialPrices[condition.id] = condition.price === 0 ? '' : condition.price.toString();
      }
    });
    
    // Remove entries for conditions that no longer exist
    Object.keys(initialPrices).forEach(conditionId => {
      if (!conditions.find(c => c.id === conditionId)) {
        delete initialPrices[conditionId];
      }
    });
    
    setPriceInputs(initialPrices);
  }, [conditions.length]); // Only depend on length, not the entire conditions array

  // If initialConditionId is provided, open editor directly
  useEffect(() => {
    if (initialConditionId) {
      setEditingConditionId(initialConditionId);
    }
  }, [initialConditionId]);

  // Update navigation context - only run when networkInfo changes to prevent infinite loops
  useEffect(() => {
    if (onNavigationChange) {
      onNavigationChange({
        canGoBack: true,
        onBack: onBack,
        title: 'Condition Options',
        subtitle: networkInfo ? `${networkInfo.colorName} - ${networkInfo.storageName} - ${networkInfo.networkType}` : undefined
      });
    }
  }, [networkInfo?.colorName, networkInfo?.storageName, networkInfo?.networkType]); // Only depend on actual values, not function references

  const handlePriceChange = (conditionId, value) => {
    console.log('🔧 handlePriceChange called:', { conditionId, value });
    
    // Update local input state
    setPriceInputs(prev => ({
      ...prev,
      [conditionId]: value
    }));
    
    // Only update the condition if it's a valid number or empty
    if (value === '' || !isNaN(parseFloat(value))) {
      const newPrice = value === '' ? 0 : parseFloat(value);
      console.log('🔧 Updating condition price:', { conditionId, newPrice });
      updateCondition(conditionId, { 
        price: newPrice
      });
    }
  };

  if (editingConditionId) {
    const condition = conditions.find(c => c.id === editingConditionId);
    if (!condition) return null;

    return (
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-bold mb-4">Edit Condition</h2>
        
        {/* Edit Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Condition Name</label>
            <input
              value={condition.name}
              onChange={(e) => updateCondition(condition.id, { name: e.target.value })}
              placeholder="e.g., Like New, Good, Fair"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Description</label>
            <input
              value={condition.description}
              onChange={(e) => updateCondition(condition.id, { description: e.target.value })}
              placeholder="Brief description of condition"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Price ($)</label>
              <input
                type="text"
                value={priceInputs[condition.id] || ''}
                onChange={(e) => handlePriceChange(condition.id, e.target.value)}
                placeholder="0.00"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Stock Quantity</label>
              <input
                type="number"
                value={condition.quantity || 0}
                onChange={(e) => updateCondition(condition.id, { quantity: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">SKU</label>
            <input
              value={condition.sku}
              onChange={(e) => updateCondition(condition.id, { sku: e.target.value })}
              placeholder="e.g., IPH15-128-U-LN"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <button 
            onClick={() => setEditingConditionId(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  if (editorOnly) {
    return null;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="font-semibold text-lg">Condition Options</h2>
          <p className="text-sm text-gray-500">Manage product conditions</p>
        </div>
        <button
          onClick={addCondition}
          className="flex items-center px-3 py-1 border rounded hover:bg-gray-100"
        >
          <span className="mr-1">+</span>
          Add Condition
        </button>
      </div>

      {/* Conditions List */}
      <div className="space-y-3">
        {conditions.map((condition, index) => (
          <div key={condition.id}>
            <div className="flex items-center gap-4 py-3">
              {/* Condition Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-5 h-5 text-gray-500 flex-shrink-0">📦</div>
                <div className="min-w-0 flex-1">
                  <h5 className="font-medium text-sm text-gray-900 truncate">
                    {condition.name}
                  </h5>
                  <p className="text-xs text-gray-500">
                    ${condition.price} • Qty: {condition.quantity}
                    {condition.description && <> • {condition.description}</>}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={condition.active !== false}
                    onChange={(e) => updateCondition(condition.id, { active: e.target.checked })}
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                </label>

                {/* Edit Icon */}
                <button
                  onClick={() => setEditingConditionId(condition.id)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Edit condition"
                >
                  <span className="text-gray-500 hover:text-gray-700">✏️</span>
                </button>

                {/* Delete Icon */}
                <button
                  onClick={() => deleteCondition(condition.id)}
                  className="p-2 hover:bg-red-100 rounded-md transition-colors"
                  title="Delete condition"
                >
                  <span className="text-gray-500 hover:text-red-500">🗑️</span>
                </button>
              </div>
            </div>

            {/* Separator */}
            {index < conditions.length - 1 && (
              <div className="border-b"></div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {conditions.length === 0 && (
        <div className="text-center py-8">
          <h3 className="text-sm font-medium text-gray-500 mb-2">No conditions yet</h3>
          <p className="text-xs text-gray-500 mb-4">
            Add condition options for this network configuration
          </p>
          <button
            onClick={addCondition}
            className="flex items-center px-3 py-1 border rounded hover:bg-gray-100 mx-auto"
          >
            <span className="mr-1">+</span>
            Add First Condition
          </button>
        </div>
      )}
    </div>
  );
};

export default ConditionsEditPage;