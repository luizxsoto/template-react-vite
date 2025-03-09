import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Image } from '@/common/components/image'
import { ThemeButton } from '@/common/components/theme-button'
import { ALL_PERMISSION_KEYS } from '@/common/constants/permission-keys'
import { i18n } from '@/common/i18n'
import { useAuth } from '@/domain/auth/contexts'

const drawerWidth = 270

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 0,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // DOCS: necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const DrawerContainer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  position: 'absolute',
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

export function Drawer({ children }: { children: React.ReactNode }): JSX.Element {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, hasPermission, loggedUser } = useAuth()

  const [open, setOpen] = useState(false)

  const headerTitle = useMemo((): string => {
    if (location.pathname === '/user/profile') {
      return i18n().modules.user.pages.profile.pageTitle
    }
    if (location.pathname.startsWith('/user/form')) {
      return i18n().modules.user.pages.form.pageTitle
    }
    if (location.pathname === '/user') {
      return i18n().modules.user.pages.list.pageTitle
    }
    return i18n().common.components.drawer.title
  }, [location])

  const handleNavigate = useCallback(
    (path: string) => {
      if (path !== location.pathname) {
        void navigate(path)
      }
    },
    [location.pathname, navigate],
  )

  const actions = useMemo(() => {
    const filteredActions = []

    if (hasPermission({ permissionKey: ALL_PERMISSION_KEYS.user.list })) {
      filteredActions.push({
        icon: <PeopleOutlinedIcon />,
        key: '/user',
        isActive: location.pathname.startsWith('/user') && location.pathname !== '/user/profile',
        label: i18n().modules.user.pages.list.pageTitle,
        handle: () => {
          handleNavigate('/user')
        },
      })
    }

    return filteredActions
  }, [handleNavigate, hasPermission, location.pathname])

  function handleDrawerOpen(): void {
    setOpen(true)
  }

  function handleDrawerClose(): void {
    setOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {open ? (
            <Box />
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 5 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography data-testid="Drawer-Title" variant="h6" noWrap component="div">
            {headerTitle}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <ThemeButton />
            <IconButton onClick={() => logout()} sx={{ color: '#f2f2f2' }}>
              <LogoutIcon fontSize="large" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <DrawerContainer variant="permanent" open={open}>
        <DrawerHeader sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {i18n().common.components.drawer.menu}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          <Tooltip title={i18n().modules.user.pages.profile.pageTitle} arrow placement="right">
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                data-testid={`Drawer-profile-${location.pathname === '/user/profile' ? 'active' : 'inactive'}`}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => handleNavigate('/user/profile')}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    alt={i18n().common.components.drawer.userImage}
                    src={loggedUser?.image}
                    sx={{ width: '50px', height: '50px', borderRadius: '25px', objectFit: 'cover' }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={loggedUser?.name}
                  secondary={loggedUser?.email}
                  sx={{
                    opacity: open ? 1 : 0,
                    ...(location.pathname === '/user/profile' && {
                      color: theme.palette.secondary.main,
                    }),
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </List>
        <Divider />
        <List sx={{ flex: 1 }}>
          {actions.map((action) => (
            <Tooltip key={action.key} title={action.label} arrow placement="right">
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  data-testid={`Drawer-ListItemButton-${action.isActive ? 'active' : 'inactive'}`}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={action.handle}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      ...(action.isActive && { color: theme.palette.secondary.main }),
                    }}
                  >
                    {action.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={action.label}
                    sx={{
                      opacity: open ? 1 : 0,
                      ...(action.isActive && { color: theme.palette.secondary.main }),
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </DrawerContainer>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%',
          [theme.breakpoints.up('sm')]: { paddingLeft: 8 },
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  )
}
