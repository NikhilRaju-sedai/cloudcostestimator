import React, { use, useEffect, useState } from 'react';
import folderIcon from '../assets/icons/folder.png';
import cloudServiceIcon from '../assets/icons/cloud-service.png';
import databaseIcon from '../assets/icons/database.png';
import questionIcon from '../assets/icons/question-mark.png';
import axios from 'axios';
import './CostEstimator.css';

const CostEstimator = () => {
    // Helper to get icon for resource type using PNGs
    const getResourceIcon = (type) => {
        if (!type) return <img src={questionIcon} alt="Database" className="resource-icon" />;
        if (type.toLowerCase().includes('database')) return <img src={databaseIcon} alt="Database" className="resource-icon" />;
        if (type.toLowerCase().includes('storage')) return <img src={folderIcon} alt="Storage" className="resource-icon" />;
        if (type.toLowerCase().includes('compute')) return <img src={cloudServiceIcon} alt="Compute" className="resource-icon" />;
        return null;
    };
    const [boxes, setBoxes] = useState([
        { resourceType: "", unit: 0, region: "", resources: [] }
    ]);
    const [regions, setRegions] = useState([]);

    useEffect(() => {
        // Fetch regions from backend
        const fetchRegions = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/regions');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    console.log("Regions fetched successfully:", response.data);
                    setRegions(response.data);
                    // Do not set region automatically; keep it empty for user selection
                }
            } catch (error) {
                console.error('Failed to fetch regions:', error);
                setRegions([]); // fallback to empty
                setRegion("");
            }
        };

        fetchRegions();
    }, []);

    // Fetch resources for selected region
    useEffect(() => {
        boxes.forEach((box, idx) => {
            if (!box.region) {
                updateBox(idx, { resources: [], resourceType: "" });
                return;
            }
            const selectedRegion = regions.find(r => r.name === box.region);
            if (!selectedRegion) {
                updateBox(idx, { resources: [], resourceType: "" });
                return;
            }
            const fetchResources = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/regions/${selectedRegion.id}/resources`);
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        updateBox(idx, { resources: response.data });
                    } else {
                        updateBox(idx, { resources: [], resourceType: "" });
                    }
                } catch (error) {
                    console.error('Failed to fetch resources:', error);
                    updateBox(idx, { resources: [], resourceType: "" });
                }
            };
            fetchResources();
        });
        // eslint-disable-next-line
    }, [boxes.map(b => b.region).join(), regions]);

    // Helper to update a box
    const updateBox = (idx, changes) => {
        setBoxes(prev => prev.map((box, i) => i === idx ? { ...box, ...changes } : box));
    };

    const calculateBoxCost = (box) => {
        const selectedResource = box.resources.find(res => res.type === box.resourceType);
        const selectedRegion = regions.find(r => r.name === box.region);
        if (selectedResource && selectedRegion && box.unit > 0) {
            const resourceCost = selectedResource.cost || 0;
            const regionMultiplier = selectedRegion.multiplier || 1;
            return (resourceCost * regionMultiplier * box.unit).toFixed(2);
        }
        return "0.00";
    }; 
    const calculateCost = (box) => {
        const selectedResource = box.resources.find(res => res.type === box.resourceType);
        const selectedRegion = regions.find(r => r.name === box.region);
        if (selectedResource && selectedRegion ) {
            const resourceCost = selectedResource.cost || 0;
            const regionMultiplier = selectedRegion.multiplier || 1;
            return (resourceCost * regionMultiplier ).toFixed(2);
        }
        return "0.00";
    }; 


    // Calculate total cost for all resources
    const calculateTotalCostAll = () => {
        return boxes.reduce((sum, box) => {
            const cost = parseFloat(calculateBoxCost(box));
            return sum + (isNaN(cost) ? 0 : cost);
        }, 0).toFixed(2);
    };

const [showBill, setShowBill] = useState(false);

const handleGetBill = () => {
  setShowBill(true);
};

const handleCloseBill = () => {
  setShowBill(false);
};



    
        return (
            <>
            
        <div className='cost-estimator-wrapper'>
        <div className="cost-estimator-container scrollable-container">
            {boxes.map((box, idx) => (
                <div className="cost-estimator-box" key={idx}>
                    <div className="cost-estimator-row-with-icon">
                        <div className="resource-type-icon-box">
                            {getResourceIcon(box.resourceType)}
                        </div>
                        <div className="cost-estimator-field">
                            <label> Region: </label>
                            <select value={box.region} onChange={e => updateBox(idx, { region: e.target.value })}>
                                <option value="" disabled>Select a region</option>
                                {regions.map((r, ridx) => (
                                    <option key={r.id || ridx} value={r.name}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="cost-estimator-field resource-type-field">
                            <label> Resource Type: </label>
                            <div className="resource-type-select-wrapper">
                                <select
                                    value={box.resourceType}
                                    onChange={e => updateBox(idx, { resourceType: e.target.value })}
                                    disabled={!box.region || box.resources.length === 0}
                                >
                                    <option value="" disabled>Select a resource</option>
                                    {box.resources.length > 0 && box.region ? (
                                        box.resources.map((res, rIdx) => (
                                            <option key={res.id || rIdx} value={res.type}>{res.type}</option>
                                        ))
                                    ) : null}
                                </select>
                            </div>
                        </div>
                        <div className="cost-estimator-field">
                            <label> Units: </label>
                            <input
                                type="number"
                                value={box.resourceType ? box.unit : ""}
                                onChange={e => updateBox(idx, { unit: e.target.value })}
                                disabled={!box.resourceType}
                                placeholder={!box.resourceType ? "Select a resource first" : "Enter units"}
                                min={0}  // prevent negative numbers
                                />

                        </div>
                        {/* Remove button for each box */}
                        <button
                            className="remove-resource-btn"
                            onClick={() => setBoxes(prev => prev.filter((_, i) => i !== idx))}
                            style={{ marginLeft: "1rem", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}
                            disabled={boxes.length === 1}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            <button className="add-resource-btn" onClick={() => setBoxes([...boxes, { resourceType: "", unit: 0, region: "", resources: [] }])}>
                Add More Resource
            </button>
            
        </div>
        <div className="cost-estimator-total">
                <h3>Total Cost: ${calculateTotalCostAll()}</h3>
                <button className='detailed-bill-button' onClick={handleGetBill}>Get detailed Bill</button>
        </div>
        </div>
        
{showBill && (
  <div className="popup-overlay">
    <div className="popup-bill">
      <h2>Detailed Bill</h2>
      <table>
        <thead>
          <tr>
            <th>Resource Type</th>
            <th>Region</th>
            <th>Unit Cost</th>
            <th>Units</th>
            <th>TotalCost</th>
          </tr>
        </thead>
        <tbody>
          {boxes
            .filter(box => box.unit) // only keep boxes that have a region
            .map((box, idx) => (
            <tr key={idx}>
                   <td>{box.resourceType}</td>
                    <td>{box.region}</td>
                    <td>${calculateCost(box)}</td>
                    <td>{box.unit}</td>
                    <td>${calculateBoxCost(box)}</td>
    </tr>
))}

        </tbody>
      </table>
      <div className="estimator-total-cost">
            Total: ${calculateTotalCostAll()}
      </div>

      <button onClick={handleCloseBill}>Close</button>
    </div>
  </div>
)}
        </>
        
    );
    
}


export default CostEstimator;
