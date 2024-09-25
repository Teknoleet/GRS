# GitHub Runner Status

An Electron-based macOS menu bar application that displays the status of GitHub self-hosted runners in your organization. The app provides a convenient way to monitor runner availability directly from your menu bar.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Entering Your GitHub Personal Access Token (PAT)](#entering-your-github-personal-access-token-pat)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)



## Prerequisites

- **Operating System**: macOS (M1 or later).
- **Node.js**: Version 14 or higher. Download from [nodejs.org](https://nodejs.org/).
- **npm**: Comes bundled with Node.js.
- **Git**: For cloning the repository (optional).

---

## Installation

1. **Clone the Repository** (or download the source code):

   ```bash
   git clone https://github.com/yourusername/github-runner-status.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd github-runner-status
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Rebuild Native Modules** (Required because `keytar` is a native module):

   ```bash
   npm run build
   ```

---

## Usage

### **Running the Application**

To start the application in development mode:

```bash
npm run start
```

- The app will launch, and an icon will appear in your macOS menu bar.
- Click the icon to open the application window.

### **Entering Your GitHub Personal Access Token (PAT)**

1. **Generate a PAT**:

   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens).
   - Click on **Generate new token**.
   - Select the following scopes:
     - **`repo`** (if accessing private repositories).
     - **`admin:org`** (for organization administration).
     - **`read:org`** (to read organization data).
   - Generate the token and **copy it**.

2. **Enter the PAT in the Application**:

   - When you first run the app, you'll be prompted to enter your PAT.
   - Paste your token into the input field and click **Save Token**.
   - The token will be securely stored in your macOS Keychain.

3. **Authorization for SSO (If Applicable)**:

   - If your organization uses Single Sign-On (SSO), you may need to authorize the token.
   - Follow GitHub's instructions to authorize your PAT for SSO.

---

##  Code Signing and Notarization (Optional)**:

   - For distributing the app outside your machine, consider code signing and notarizing the app.
   - Requires an Apple Developer Account.
