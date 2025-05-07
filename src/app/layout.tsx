import { menuTreePromise } from "../menu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    menuTreePromise.then((menu) => {
      console.log(menu);
      setMenuItems(menu);
    });
  }, []);
  return (
    <div>
      <div>
        <MenuList items={menuItems} />
      </div>
      {children}
    </div>
  );
}

type MenuItem = {
  title: string;
  path: string;
  disabled?: boolean;
  children?: MenuItem[];
};

const MenuList: React.FC<{ items: MenuItem[] }> = ({ items }) => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path, { replace: true });
  };

  return (
    <ul>
      {items.map((item) => (
        <li key={item.path} style={{ margin: 3 }}>
          <button
            onClick={() => handleClick(item.path)}
            style={{ cursor: "pointer" }}
            disabled={item.disabled}
          >
            {item.title}
          </button>
          {item.children && item.children.length > 0 && (
            <MenuList items={item.children} />
          )}
        </li>
      ))}
    </ul>
  );
};

// function addMethod(object,name,fn){
//   const old = object[name]
//   object[name] = function (...args){
//     if(args.length===fn.length){
//       return fn.applu(this.args)
//     }else if(typeof old==="function"){
//       return old.apply(this,args)
//     }
//   }
// }
