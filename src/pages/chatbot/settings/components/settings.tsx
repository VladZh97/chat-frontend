import Header from './header';
import SettingsSide from './settings-side';

const Settings = () => {
  return (
    <div>
      <Header />
      <div className="grid grid-cols-2">
        <SettingsSide />
      </div>
    </div>
  );
};

export default Settings;
