const IconBase = ({ className = "w-6 h-6", children }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

export const ShieldIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M12 3l7 3v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-3z" />
    <path d="M9 11l3 3 3-3" />
  </IconBase>
)

export const StudentCapIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M3 9l9-4 9 4-9 4-9-4z" />
    <path d="M12 13v6" />
    <path d="M7 11.5v2c0 2 2.5 3.5 5 3.5s5-1.5 5-3.5v-2" />
    <path d="M21 9v4" />
  </IconBase>
)

export const ProfessorBoardIcon = ({ className }) => (
  <IconBase className={className}>
    <rect x="3" y="6" width="18" height="11" rx="2" fill="none" />
    <path d="M8 10h8" />
    <path d="M8 13h5" />
    <path d="M7 17v4" />
    <path d="M17 17v4" />
  </IconBase>
)

export const CalendarIcon = ({ className }) => (
  <IconBase className={className}>
    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M3 11h18" />
    <path d="M7 15h2" />
    <path d="M11 15h2" />
    <path d="M15 15h2" />
  </IconBase>
)

export const ClipboardIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M9 4h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2z" />
    <path d="M9 2h6v4H9z" />
    <path d="M9 10h6" />
    <path d="M9 14h6" />
    <path d="M9 18h4" />
  </IconBase>
)

export const ChartIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M4 19h16" />
    <path d="M5 14l4-4 3 3 5-6" />
    <path d="M16 7h4v4" />
  </IconBase>
)

export const BellIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M6 17l1.2-1.2A2 2 0 007.8 14V11a4.2 4.2 0 118.4 0v3c0 .5.2 1 .6 1.4L18 17" />
    <path d="M9 17a3 3 0 006 0" />
    <path d="M18 5V3" />
    <path d="M6 5V3" />
  </IconBase>
)

export const FolderIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M3 7a2 2 0 012-2h5l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </IconBase>
)

export const UsersIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="9" cy="8" r="3" />
    <path d="M4 19v-1.5a4.5 4.5 0 014.5-4.5H11a4.5 4.5 0 014.5 4.5V19" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M17 14a4 4 0 014 4v1" />
  </IconBase>
)

export const CheckCircleIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
  </IconBase>
)

export const HourglassIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M6 3h12" />
    <path d="M6 21h12" />
    <path d="M6 3c0 4 3 5.5 6 8 3-2.5 6-4 6-8" />
    <path d="M6 21c0-4 3-5.5 6-8 3 2.5 6 4 6 8" />
  </IconBase>
)

export const ArrowUpIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </IconBase>
)

export const ArrowDownIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M12 5v14" />
    <path d="M19 12l-7 7-7-7" />
  </IconBase>
)

export const SortIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M3 6h18" />
    <path d="M7 12h10" />
    <path d="M10 18h4" />
  </IconBase>
)

export const SearchIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </IconBase>
)

export const XIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </IconBase>
)

