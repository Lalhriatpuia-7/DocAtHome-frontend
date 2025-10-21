import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../apis/appoinmentApi";
import { logoutUser } from "../apis/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ new

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false); // ✅ finished loading even if no token
      return;
    }

    getCurrentUser({}, token)
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false)); // ✅ always stop loading
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    setLoading(true);
    try {
      const data = await getCurrentUser({}, token);
      setUser(data);
    } catch (err) {
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser(localStorage.getItem("token")).catch(console.error);
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


// import { createContext, useState, useEffect } from "react";
// import { getCurrentUser } from "../apis/appoinmentApi";
// import { logoutUser } from "../apis/authApi";


// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);


 

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
    
//     getCurrentUser({}, token)
//       .then(data => {
//         setUser(data);
//       })
//       .catch(() => setUser(null));
//   }, []);


  
//   const login = (token) => {
//     const userData = getCurrentUser({}, token)
//       .then(data => {
//         setUser(data);
//       } 
//       ).catch(() => setUser(null));
//   };
//   const logout = () => {
    
//     logoutUser(localStorage.getItem("token")).catch(err => console.error(err));
//     localStorage.removeItem("token");
//     setUser(null);
//     window.location.href = "/login";
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout,  }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
