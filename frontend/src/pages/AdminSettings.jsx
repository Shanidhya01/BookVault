import { useEffect, useState } from "react";
import api from "../api";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    maxBooksPerUser: 3,
    loanPeriodDays: 14,
    finePerDay: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/settings")
      .then((res) => {
        setSettings(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load settings");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/settings", settings);
      setSaving(false);
      alert("Settings updated!");
    } catch {
      setError("Failed to save settings");
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <>
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow mt-10">
        <h2 className="text-2xl font-bold mb-6">Library Rules & Settings</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">
              Max Books Per User
            </label>
            <input
              type="number"
              name="maxBooksPerUser"
              value={settings.maxBooksPerUser}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              min={1}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Loan Period (days)
            </label>
            <input
              type="number"
              name="loanPeriodDays"
              value={settings.loanPeriodDays}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              min={1}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Fine Per Day (₹)</label>
            <input
              type="number"
              name="finePerDay"
              value={settings.finePerDay}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              min={0}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded font-semibold"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </>
  );
}
