import { useState,useEffect } from "react";
import api from "../api/axios";

function AddApplicationModal({ onClose, onApplicationAdded,application }) {
  const [formData, setFormData] = useState({
  company: "",
  role: "",
  jobLink: "",
  status: "Applied",
  followUpDate: "",
  notes: "",
});

useEffect(() => {
  if (application) {
    setFormData({
      company: application.company || "",
      role: application.role || "",
      jobLink: application.jobLink || "",
      status: application.status || "Applied",
      followUpDate: application.followUpDate
        ? application.followUpDate.split("T")[0]
        : "",
      notes: application.notes || "",
    });
  }
}, [application]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  let res;

  if (application) {
    res = await api.put(
      `/applications/${application._id}`,
      formData
    );
  } else {
    res = await api.post(
      "/applications",
      formData
    );
  }

  onApplicationAdded(res.data.application);
  onClose();
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Add Application
            </h2>
            <p className="text-slate-500">
              Save a new job application.
            </p>
          </div>

          <button onClick={onClose} className="text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input
  name="company"
  placeholder="Company"
  value={formData.company}
  onChange={handleChange}
  className="p-3 border rounded-xl"
/>

<input
  name="role"
  placeholder="Role"
  value={formData.role}
  onChange={handleChange}
  className="p-3 border rounded-xl"
/>

<input
  name="jobLink"
  placeholder="Job Link"
  value={formData.jobLink}
  onChange={handleChange}
  className="p-3 border rounded-xl md:col-span-2"
/>

<select
  name="status"
  value={formData.status}
  onChange={handleChange}
  className="p-3 border rounded-xl"
>
  <option>Saved</option>
  <option>Applied</option>
  <option>Assessment</option>
  <option>Interview</option>
  <option>Offer</option>
  <option>Rejected</option>
</select>

<input
  name="followUpDate"
  type="date"
  value={formData.followUpDate}
  onChange={handleChange}
  className="p-3 border rounded-xl"
/>

<textarea
  name="notes"
  placeholder="Notes"
  value={formData.notes}
  onChange={handleChange}
  className="p-3 border rounded-xl md:col-span-2"
/>
          <button
  type="submit"
  className="md:col-span-2 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:scale-[1.02] hover:shadow-blue-500/40 transition-all duration-300"
>
  <span className="text-lg">
    {application ? "✏️" : "➕"}
  </span>

  {application
    ? "Update Application"
    : "Save Application"}
</button>
        </form>
      </div>
    </div>
  );
}

export default AddApplicationModal;