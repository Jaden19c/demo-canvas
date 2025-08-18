import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen">
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
      <Outlet />
    </div>
  );
}
