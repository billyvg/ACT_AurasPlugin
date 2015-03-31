﻿using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Weak.AurasPlugin
{
    public class OverlayAddonMain : IOverlayAddon
    {
        // OverlayPluginのリソースフォルダ
        public static string ResourcesDirectory = String.Empty;
        public static string UpdateMessage = String.Empty;

        public OverlayAddonMain()
        {
            // OverlayPlugin.Coreを期待
            Assembly asm = System.Reflection.Assembly.GetCallingAssembly();
            if (asm.Location == null || asm.Location == "")
            {
                // 場所がわからないなら自分の場所にする
                asm = Assembly.GetExecutingAssembly();
            }
            ResourcesDirectory = System.IO.Path.Combine(System.IO.Path.GetDirectoryName(asm.Location), "resources");
        }

        static OverlayAddonMain()
        {
            // static constructor should be called only once
            UpdateMessage = UpdateChecker.Check();
        }

        public string Name
        {
            get { return "Auras"; }
        }

        public string Description
        {
            get { return "Displays graphics on the screen when stances are changed."; }
        }

        public Type OverlayType
        {
            get { return typeof(AurasOverlay); }
        }

        public Type OverlayConfigType
        {
            get { return typeof(AurasOverlayConfig); }
        }

        public Type OverlayConfigControlType
        {
            get { return typeof(AurasOverlayConfigPanel); }
        }

        public IOverlay CreateOverlayInstance(IOverlayConfig config)
        {
            return new AurasOverlay((AurasOverlayConfig)config);
        }

        public IOverlayConfig CreateOverlayConfigInstance(string name)
        {
            return new AurasOverlayConfig(name);
        }

        public System.Windows.Forms.Control CreateOverlayConfigControlInstance(IOverlay overlay)
        {
            return new AurasOverlayConfigPanel((AurasOverlay)overlay);
        }

        public void Dispose()
        {

        }
    }
}