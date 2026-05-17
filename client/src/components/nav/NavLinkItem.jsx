import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function NavLinkItem({ to, label, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className="group relative px-1 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? 'text-blue-600' : ''}>{label}</span>
          <motion.span
            className="absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-blue-600"
            initial={false}
            animate={{ width: isActive ? '100%' : '0%' }}
            transition={{ duration: 0.25 }}
          />
          <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-blue-400 transition-all duration-300 group-hover:w-full group-[.active]:hidden" />
        </>
      )}
    </NavLink>
  );
}

export default NavLinkItem;
