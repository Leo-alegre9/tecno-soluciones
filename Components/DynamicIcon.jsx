'use client';

import {
    Smartphone,
    Laptop,
    Cpu,
    Headphones,
    Tablet,
    Plug,
    Monitor,
    Gamepad2,
    Camera,
    Watch,
    Wrench,
    Apple,
    Globe,
    SearchCheck,
    Battery,
    HardDrive,
    Keyboard,
    Mouse,
    Printer,
    Router,
    Speaker,
    Tv,
    Wifi,
    Zap,
} from 'lucide-react';

const ICONS = {
    smartphone: Smartphone,
    laptop: Laptop,
    cpu: Cpu,
    headphones: Headphones,
    tablet: Tablet,
    plug: Plug,
    monitor: Monitor,
    'gamepad-2': Gamepad2,
    camera: Camera,
    watch: Watch,
    wrench: Wrench,
    apple: Apple,
    globe: Globe,
    'search-check': SearchCheck,
    battery: Battery,
    'hard-drive': HardDrive,
    keyboard: Keyboard,
    mouse: Mouse,
    printer: Printer,
    router: Router,
    speaker: Speaker,
    tv: Tv,
    wifi: Wifi,
    zap: Zap,
};

export default function DynamicIcon({ name, className, fallback = Cpu }) {
    const Icon = ICONS[String(name || '').toLowerCase()] || fallback;
    return <Icon className={className} />;
}
