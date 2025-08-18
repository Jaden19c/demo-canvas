import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useThemeStore from "@/stores/theme";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();
  const { toggleScreenMode } = useThemeStore();
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex flex-col">
        <div className="h-[100px] w-full bg-blue-100 flex items-center justify-center">
          <ToggleGroup
            type="single"
            onValueChange={(value) => {
              navigate(value ?? "/");
            }}
          >
            <ToggleGroupItem value="home" asChild>
              <Link to="/">Home</Link>
            </ToggleGroupItem>
            <ToggleGroupItem value="map" asChild>
              <Link to="/map">Map</Link>
            </ToggleGroupItem>
            <ToggleGroupItem value="demo" asChild>
              <Link to="/demo">Demo</Link>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="w-full h-[100px] bg-blue-100 flex items-center justify-center">
          <Button variant="outline" onClick={() => toggleScreenMode()}>
            Toggle Width
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
