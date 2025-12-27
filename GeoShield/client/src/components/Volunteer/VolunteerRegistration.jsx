import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const VolunteerRegistration = ({ onComplete }) => {
  const { registerVolunteer, sendVerificationCode, verifyCode } = useApp();
  const [step, setStep] = useState('phone'); // 'phone', 'verify', 'details'
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    skills: [],
    resources: [],
    availability: '8am-8pm',
    lat: 43.2557,
    lng: -79.8711
  });

  const skillsOptions = ['Transportation', 'Medical', 'Translation', 'Heavy Lifting'];
  const resourcesOptions = ['Vehicle', 'Medical Supplies', 'Tools'];

  const handleSkillToggle = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter(s => s !== skill)
        : [...formData.skills, skill]
    });
  };

  const handleResourceToggle = (resource) => {
    setFormData({
      ...formData,
      resources: formData.resources.includes(resource)
        ? formData.resources.filter(r => r !== resource)
        : [...formData.resources, resource]
    });
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const result = await sendVerificationCode(phone, 'volunteer');
      setSentCode(result.code); // For demo - in production, don't show this
      setFormData({ ...formData, phone });
      setStep('verify');
    } catch (error) {
      console.error('Error sending code:', error);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      await verifyCode(phone, verificationCode);
      setStep('details');
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const volunteer = await registerVolunteer({ ...formData, verified: true });
      onComplete(volunteer);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">Volunteer Registration</h2>
          <p className="text-gray-600 text-center mb-6">Enter your phone number to receive a verification code</p>
          
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="905-555-1234"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Send Verification Code
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">Verify Phone Number</h2>
          <p className="text-gray-600 text-center mb-2">Enter the 6-digit code sent to {phone}</p>
          {sentCode && (
            <p className="text-sm text-blue-600 text-center mb-4">Demo code: {sentCode}</p>
          )}
          
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code *
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Verify Code
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Volunteer Registration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {skillsOptions.map(skill => (
                <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="rounded"
                  />
                  <span className="text-sm">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resources Available
            </label>
            <div className="grid grid-cols-2 gap-2">
              {resourcesOptions.map(resource => (
                <label key={resource} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.resources.includes(resource)}
                    onChange={() => handleResourceToggle(resource)}
                    className="rounded"
                  />
                  <span className="text-sm">{resource}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability *
            </label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="8am-8pm">8am-8pm</option>
              <option value="24/7">24/7</option>
              <option value="9am-6pm">9am-6pm</option>
              <option value="Evenings">Evenings</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register as Volunteer
          </button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerRegistration;

