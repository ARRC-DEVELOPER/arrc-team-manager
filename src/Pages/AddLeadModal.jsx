import React, { useState } from 'react';
import { HiX, HiPlus } from 'react-icons/hi';
import axios from 'axios';
import { server } from '../main';
import { message } from 'antd';

const AddLeadModal = ({ isOpen, onClose, selectedLeadId }) => {
    const [formData, setFormData] = useState({
        company: '',
        title: 'Mr.',
        firstName: '',
        lastName: '',
        email: '',
        mobile: '+91',
        country: 'India',
        state: '',
        city: '',
        executive: 'RD Sharma',
        source: '',
        designation: '',
        product: '',
        requirements: '',
        notes: ''
    });

    const handleSave = async (addAnother = false) => {
        try {
            const leadData = [{
                "Client Name": `${formData.title} ${formData.firstName} ${formData.lastName}`.trim(),
                "Mobile Number": formData.mobile,
                "City": formData.city
            }];

            console.log(leadData);

            await axios.post(`${server}/leads/addLead/${selectedLeadId}`, {
                leads: leadData
            });

            message.success("Lead added Successfully..!");
            
            if (addAnother) {
                setFormData({
                    ...formData,
                    firstName: '',
                    lastName: '',
                    mobile: '+91',
                    city: '',
                    email: '',
                    designation: '',
                    product: '',
                    requirements: '',
                    notes: ''
                });
            } else {
                onClose();
            }
        } catch (error) {
            console.error("Failed to save lead:", error);
            message.error("Failed to save lead");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 sticky top-0 z-50 bg-white pb-4 border-b">
                    <h3 className="text-xl font-medium text-gray-900">Enter Lead</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleSave(false)}
                            className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <HiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <h4 className="font-medium">Basic Information</h4>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">
                                    Company <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        className="w-24 p-2 border rounded"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    >
                                        <option>Mr.</option>
                                        <option>Mrs.</option>
                                        <option>Ms.</option>
                                        <option>Dr.</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="flex-1 p-2 border rounded"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="flex-1 p-2 border rounded"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <h4 className="font-medium text-green-600">Contact Details</h4>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full p-2 border rounded"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-1">
                                            Mobile <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-1">Country</label>
                                        <select
                                            className="w-full p-2 border rounded"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        >
                                            <option>India</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-1">State</label>
                                        <select
                                            className="w-full p-2 border rounded"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        >
                                            <option value="">Select</option>
                                            <option>Maharashtra</option>
                                            <option>Delhi</option>
                                            <option>Karnataka</option>
                                        </select>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm mb-1">City</label>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                            <button className="absolute right-2 top-8 p-1 bg-orange-100 text-orange-500 rounded">
                                                <HiPlus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <h4 className="font-medium text-orange-500">Business Details</h4>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Executive</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={formData.executive}
                                    onChange={(e) => setFormData({ ...formData, executive: e.target.value })}
                                >
                                    <option>RD Sharma</option>
                                </select>
                            </div>

                            <div className="relative">
                                <label className="block text-sm mb-1">Source</label>
                                <div className="flex">
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={formData.source}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option>Website</option>
                                        <option>Referral</option>
                                        <option>Other</option>
                                    </select>
                                    <button className="absolute right-2 top-8 p-1 bg-orange-100 text-orange-500 rounded">
                                        <HiPlus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Designation</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm mb-1">Product</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.product}
                                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                    />
                                    <button className="absolute right-2 top-8 p-1 bg-orange-100 text-orange-500 rounded">
                                        <HiPlus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Requirements</label>
                                <textarea
                                    className="w-full p-2 border rounded h-24"
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Notes</label>
                                <textarea
                                    className="w-full p-2 border rounded h-24"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-2  bottom-0 bg-white pt-4 border-t">
                    <button
                        onClick={() => handleSave(false)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Save & Add Another
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddLeadModal;

