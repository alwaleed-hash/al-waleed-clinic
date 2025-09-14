import TodayAppointments from "./todays-appointments";

const OverviewTab = () => {
  return (
    <div className="space-y-6">
      <div className="">
        {/* Today's Appointments */}
        <div className="rounded-xl shadow-sm p-6">
          <div className="">
            <TodayAppointments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
