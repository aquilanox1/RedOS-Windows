# RedOS Launcher for Windows

RedOS is an Electron desktop launcher with a Windows 8 / iOS-inspired tile workspace, black/red/graphite styling, drag-and-drop ordering, custom tiles, and Windows app shortcuts.

## Build on GitHub Actions (no Visual Studio / Android Studio required)

1. In your `RedOSLauncher` GitHub repository, create a folder named `windows-redos`.
2. Upload the contents of this folder into `windows-redos` (keep `package.json` and `src` inside it).
3. Upload `.github/workflows/build-windows.yml` to the repository path `.github/workflows/build-windows.yml`.
4. Commit the changes.
5. Open the **Actions** tab and select **Build RedOS Windows Installer**.
6. When the run is green, open it and download **RedOS-Windows-Installer** under Artifacts.
7. Extract the ZIP and run `RedOS-Launcher-Setup-1.0.0.exe`.

The workflow also runs automatically when files under `windows-redos/` or the workflow change.

## Local development

Requires Node.js 22 or newer:

```bash
npm install
npm start
npm run dist
```

## Using tiles

- Built-in tiles launch File Explorer, the browser, Windows Settings, Notepad, Calculator, Terminal, Paint, and the Downloads shortcut.
- Use **Add tile** to add an `.exe` / `.lnk`, folder path, or website URL.
- Drag tiles to reorder them. Tile order and custom tiles are stored locally in the Windows user profile.

## Notes

- This is a launcher app, not a replacement Windows shell.
- Windows Defender / SmartScreen may show an unknown-publisher warning because the installer is not code-signed. Only install builds from your own trusted GitHub repository.
- This project has not been built or tested on a Windows machine in this environment. GitHub Actions is configured to perform the Windows build and will report any build errors.
