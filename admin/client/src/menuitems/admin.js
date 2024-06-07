import { AccountBalanceWallet, AutoAwesome, Ballot, BedroomBaby, Casino, ContentCut, CurrencyBitcoin, DashboardRounded, EmojiEvents, Engineering, Gamepad, GroupRounded, Language, MilitaryTech, Paid, PermContactCalendarSharp, Pin, PlaylistAddCheck, RequestQuote, SettingsSuggest, ShutterSpeed, SmartToy, Stars, Timeline, Vrpano, Workspaces } from "@mui/icons-material";
import { ReactComponent as BombIcon } from "assets/icons/bombicon.svg";

const menuItems = [
    {
        url: '/dashboard',
        icon: <DashboardRounded />,
        text: 'Dashboard',
        headerTitle: 'Dashboard'
    },
    {
        icon: <GroupRounded />,
        text: 'Player Management',
        child: [
            {
                url: '/player/player-list',
                icon: <PermContactCalendarSharp />,
                text: 'Player List'
            }
        ]
    },
    {
        icon: <Gamepad />,
        text: 'Game Management',
        child: [
            {
                url: '/game/game-list',
                icon: <BedroomBaby />,
                text: 'Game List'
            }
        ]
    },
    {
        url: '/change-password',
        icon: null,
        text: 'Profile',
        headerTitle: 'Change Password'
    },
    {
        url: '/setting',
        icon: null,
        text: 'Setting',
        headerTitle: 'Setting'
    },
    // {
    //     url: '/wallet-detail',
    //     icon: null,
    //     text: 'Wallet Detail',
    //     headerTitle: 'Wallet Detail'
    // },
    {
        url: '/player-detail',
        icon: null,
        text: 'Player Detail',
        headerTitle: 'Player Detail'
    }
]

export default menuItems;