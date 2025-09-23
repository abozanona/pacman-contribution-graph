/******/ var __webpack_modules__ = ({

/***/ "./src/core/constants.ts":
/*!*******************************!*\
  !*** ./src/core/constants.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CELL_SIZE: () => (/* binding */ CELL_SIZE),
/* harmony export */   DELTA_TIME: () => (/* binding */ DELTA_TIME),
/* harmony export */   GAME_THEMES: () => (/* binding */ GAME_THEMES),
/* harmony export */   GAP_SIZE: () => (/* binding */ GAP_SIZE),
/* harmony export */   GHOSTS: () => (/* binding */ GHOSTS),
/* harmony export */   GHOST_NAMES: () => (/* binding */ GHOST_NAMES),
/* harmony export */   GRID_HEIGHT: () => (/* binding */ GRID_HEIGHT),
/* harmony export */   GRID_WIDTH: () => (/* binding */ GRID_WIDTH),
/* harmony export */   MONTHS: () => (/* binding */ MONTHS),
/* harmony export */   PACMAN_COLOR: () => (/* binding */ PACMAN_COLOR),
/* harmony export */   PACMAN_COLOR_DEAD: () => (/* binding */ PACMAN_COLOR_DEAD),
/* harmony export */   PACMAN_COLOR_POWERUP: () => (/* binding */ PACMAN_COLOR_POWERUP),
/* harmony export */   PACMAN_DEATH_DURATION: () => (/* binding */ PACMAN_DEATH_DURATION),
/* harmony export */   PACMAN_POWERUP_DURATION: () => (/* binding */ PACMAN_POWERUP_DURATION),
/* harmony export */   WALLS: () => (/* binding */ WALLS),
/* harmony export */   hasWall: () => (/* binding */ hasWall),
/* harmony export */   setWall: () => (/* binding */ setWall)
/* harmony export */ });
/* ───────────── General settings ───────────── */
const CELL_SIZE = 20;
const GAP_SIZE = 2;
const GRID_WIDTH = 53; // 52 weeks + current week
const GRID_HEIGHT = 7; // Sun … Sat
const PACMAN_COLOR = 'yellow';
const PACMAN_COLOR_POWERUP = 'red';
const PACMAN_COLOR_DEAD = '#80808064';
const GHOST_NAMES = ['blinky', 'clyde', 'inky', 'pinky', 'eyes'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DELTA_TIME = 200;
const PACMAN_DEATH_DURATION = 10;
const PACMAN_POWERUP_DURATION = 15;
/* ───────────── Official GitHub Palettes ─────────────
   5-color array: 0 = NONE … 4 = FOURTH_QUARTILE          */
const GITHUB_LIGHT = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const GITHUB_DARK = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
const GITLAB_LIGHT = ['#ececef', '#d2dcff', '#7992f5', '#4e65cd', '#303470'];
const GITLAB_DARK = ['#2a2a3d', '#4a5bdc', '#2e3dbf', '#1b2e8a', '#0f1a4e'];
/* ───────────── Game Themes ───────────── */
const GAME_THEMES = {
    /* ---------- GitHub ---------- */
    github: {
        textColor: '#57606a',
        gridBackground: '#ffffff',
        wallColor: '#000000',
        intensityColors: GITHUB_LIGHT
    },
    'github-dark': {
        textColor: '#8b949e',
        gridBackground: '#0d1117',
        wallColor: '#ffffff',
        intensityColors: GITHUB_DARK
    },
    /* ---------- GitLab ---------- */
    gitlab: {
        textColor: '#626167',
        gridBackground: '#ffffff',
        wallColor: '#000000',
        intensityColors: GITLAB_LIGHT
    },
    'gitlab-dark': {
        textColor: '#999999',
        gridBackground: '#1f1f1f',
        wallColor: '#ffffff',
        intensityColors: GITLAB_DARK
    }
};
const GHOSTS = {
    blinky: {
        up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiklEQVR4nIXSO2sVURQF4G8mMwa8QU2KxFcjCoIgacR/oCBYCP4fsTEIBkWwEK21UAQLIdjYaKEiJIXBXhNBCFaSeDP3zLa4mdyj5rHgwNmPtffZ62z+Q4miKHlWs3yALwUvKYphbC8UjDN3nIUB/SCCSDRnWKiZVxTFrvxp5kMRHbEltaTODuIED3YkT3FnUy+uS815qQkzMSJOxAWpuSo1A72Y4f5f5DFuBpE+vmsmZ9ukF9Eu/xwV+Pw1TEYcOtum9GmxCaLmdl7jeRDp968mcnQFMqS02bSkMV5tS36UBL6t7ixO6o/uK6sKymM0Q9l5NKC/Ldb3lWGrqenRCw73hr61H9viDujjKbztnLnae50uF4sl1nf91/2xvt9q7YuyEwKCNg+2DFoGue/fnHLoGwbyZQ/akqqkykkFZW6XmNy6VJdYyhPP8eE07/PCl1kqqbbMI3BrjY1rvMH4SW4kmou86Eac5UmiOcUcxq/wep2NirugYh4TXfOah6izUauax5leB2vuwR+e2vAshd8i9AAAAABJRU5ErkJggg==',
        down: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABmUlEQVR4nHXTT0tUYRQG8N97/TOloSYpYv/BNlLYqqJli1Z9gz5SOwkKgpDaRBS5CKJ2fYFWrsyNZWKSOYliw8y9p8XMHa+Tc+ByOec8z/M+7z3nJidHwhtc7ORreIjog29H1iYunmc5iPIpyGd5h0cd8ZNPvcLzXmJBXq1N8/g/kSSlyywFkdPMaVZJvfVZnkhHImmSZyWol9jrqMSMsti5tmhwJyhSO+8bZT8ogrulQDbDQZe8/ZPt38eZA9jbZ2OjKzTFPpJxPrdoBFFsruVRxq+tI/v1nW45vn2NIFo0TvMxTdLcYRBt+DHPne/Up36GvaygDn+p17+srp+d59S1KHyvXOPHgaFLTC9gfUtQdDp/TLAbRJPDQ2O7cyIuiAgzlQlcjSkR8yLCWJS7McJGV6Df2HoXqZqPsJmVdk56J7JEVrGsmida2TATZeM+q+U4E9kcKzdYqe7Hg+OYcdN8atG41f5Zagu8KMhv8rbck9u8L8iv8xS1e3xo0TjHMgyM8BJDnUMGa7xWjrYdQ8O8cuSkNsoSsn/EzgO2a6zxyAAAAABJRU5ErkJggg==',
        left: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzklEQVR4nIWSy2tTURCHvzNnzk0TS21sQluhq4Kb+sAH4qrgyoV/oNuCUIogEUGKf4DoolBFfCC4sYKgDVXig/Tec8ZF7k1uo9GBWczvnN8H84DpcM6h6ruw14VBBwZdeIX3inPuj//18FkmS/jtDdgvYGhgBhYhvwwv2khPs8z/3R2CnIcHlWlWXsXvMleDOEBVZaM0R8gTxGljghghN7BLyK4PwY/6UeUsbNuZlsVvn3JLyWz+1MTc8mbHP8x+HpmpWgVZhh5OKsbc0/6bgxhjzM3MbDicAN4f2jj6fUsQE8R52McBrcz7VbpPaJmxWALMxoBOMPMrE0bV3hXYC42grMCziOY3SJG18lf+fQxYx6y1XupfP1t9M6vwkjZ8GQ3JR3t3YHY8MGvWZsBpsw99s8GhmZwcbBd+sQQf/7e6WdmBIynKdRqkf17ZjBCrFdMQg5SgmNbqNySuFAySGwFP1AI6rVW1g0KANoCA3oK3DqR8lIvw/Bzs17Xb8LqqBTosI70ChjfhEVnWuIC/EyHfhIc4L2jmrqH3IuTX0S2azcYmcr+A4RrymCwEafuwJaoNAB+CLKjuiGoY9+q9XxDdcSF4AFEJiyJ3QwjyGx0DPZpbZTAYAAAAAElFTkSuQmCC',
        right: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABp0lEQVR4nI3TO2tUQRQH8N+9e9eg0YBBlwR8gNHKRqz8Amph4zcSBCWgEBALQbAU0U4EUewsfDQJNuIDiaAkSNhCY3Rz79xjsdndaxKDB6aYM//HzDln2DayrMXDgrct3hXcR7Y9dhMT14/wNFEGEURFb5onuLKjzDQ3B6QgalJNauamuLYt+SA3gkiUTffBauYPbBbJmB2AalJ8+Ryx2o1oN0Qm9kSdeim9Xyh/FFm0uNzUeFSTEmUsfoxhLC6NBNbXIyIipVR+fTGf8AAKZB2qjDyoHZ0B+04wvjJleWDRbisTuzponcon5Om7OoN7Fb1hsVY+RUTE2PGIw2J0g6jjd0TYG3FBnSp6uAPzg4oPwd1vEUvdCJ2RwNRk/1mvPwyxeF5gbUtLJjtb27TcJdsyBGs58n+Mxf9E6y9yUDf3NVVNtQOmzm0Agjpr3Cb6h0VO0SQNu9WPlGNS/x3FWRaawBlenuRVU/g8b/J++2G/grlVfp3jMcaOMZsoT3O3ryM/w4OK3iEuYewiz9b4iasDtznsHpi3uG3kAu2CW0Zfery98R/+AA8N/U/uOBf2AAAAAElFTkSuQmCC'
    },
    pinky: {
        up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkElEQVR4nG2TT2hcVRTGf/fc+2bey4xJk9hoXGlMES0uCoVoF4IWW1BEkWBB6lKwEPBPLXUlhYIYEiouRDdSsGDalJYmrtIuhECLC0MQIaWmgo2RJo0WMmn+zMy997h4aScTenbn+8453+E798L2EECMFHDjCWbRwoLDTmBEcrI5TFNiDWVjhtJgX549fGV3W+nplKisV+dqu344+NuKrP1SMeZDfNSHDsgonprq//njZ7v2QpJAYZOoAhswW5lm37mXvvlX7w00rZEkiSlRHLz5/mXd1xbqEOr6kaoeq6l+qqqfqEKoP1/21bkPJrWMG7bW5uLGGIDj1/svqq/4as+LqjjVym1V/TKqnlBdW1ClRfWJPap+xVf/endcgc+NMThVBejY6UrQAn9e27JazUCA7DHQ1RwKAbq0FaBTVRFxTtpNKU1dEe5us7gG1IGwBVuGLEnoIMuMtWKAL268ef5Y73NvI8E7jhagCxhSmN/0uLsOx5Nc4NQaUVN/64+f6Lnw1rcOKJVc0WHwrCYwCFiFumncaDGBzzxEB7UClKHVpA4oOSCEGPNCFyFY8Kb5wApsuM3D50RdPECQBgSEmDc2gIYBFhAFzcVMFADbeJsKMbVeVSOqoEpIqYUitTwPqBJjwXoCaN4aBfAh+BjT6OXO786YuqgQY6rezk0VZP7XQiyqRyxGosidaRez6GMIEfACdO7IOsUt/Zc+dfbA2MTMdzVTNrJy+6orjPSdcT++cHr5n0lHBpMz3/snR1+95Jb+TtvTRwR4FOCNM6+cXOorPTMKOIF3xl77er3btn8FgMDjbufQ+OvDVYH3ALen3Ds6sv/EMtB/34FDQEtusgE4wpa/K4IAAyIPoIx8GP8DW7gOkh3Y7ZsAAAAASUVORK5CYII=',
        down: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACZ0lEQVR4nHWRy4vNYRjHP8/ze885c+GIuTSZxriMS6KkKeQSK0lRDAsbthaTzSyUqYlhxYIsJkTNiGYh+RMYKRFTM5Fxq8ll3BriMOac3+95LM45GYOn3sX79n2/l+cL/58e4CkwAtwFwr9A8tfNOQJsernr2toFtauyFPIgORp7tw68TT6PAgcA+zcBdD7be6O7pXYDVNbgkVsRJEruPR6/puH85hsfyO0uk0gJgOOdT3b1d7csbctLQVRjDXhZxrHgMQH041Cov7jx+kdye0TERERw90PDOy6fXr5yXyxfRcVRomnmzADHqiTWT4Mhc7H1ch72q7sDNC+qnI/FFkslyhwB8d+f3SBL8RTAq5otDysA11IMicSQClE6BI4CS7yYUoB6h2MKxyOYC1JItEGyeSAC6B7c2Tdhhy3xN/7nnHD3jrz7xJQ3c7cuS5L99wsKdxRoakrXVzhu1JTilt1nAI+gYlrVATQ1NxgsUyA/GSfgwBdYvB4ihVfPgRQgCuOgjSDV4O9AIlFsEmBCAfEIUOBsQsNIUajpFPCmALHDSWgag+wPkFPANyAogAbABcDBc2q396HFtYJZFBMc/S5htL0UL7ZYEBUxBUyBxA085Sb510rKIICn3fTHWNBvo4FM0aFn3PTnWPCUW0k2VmDWjFSGKCHdemXL0IMXvUYFyM9Xurh39aCcWziQez8AlWDjD3VZ3+pBHX8USGcB6gDab23r+by9dt09oErg4HDb1ck1M5feLK2RaqIzI3v7JxeEuj4gPU9nX3rc1j+RRq6Wy+kCaqeUdQaYMa28C2XCYpH0iKC/AKR7DJ4ZSbreAAAAAElFTkSuQmCC',
        left: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnklEQVR4nG2TTYiVZRTHf+c8z/vee+emNVycYBocHAqGEN3IgEgg7bIZBir72CW2aNEERZiK6Ci4sNrooi9q02KaZhYubNGuhVEkLcqmLkhpwgwqRGBzZ+6d+77POS7uxUw8yz+HP/+Pc+C+EREIIsAc8AdwBVhEEOT+bf4PxTySinQid9+z8vKFpxoDT1RB+KdzrTM69+zFDuknsni0LMoHEAhkzuzV/V+fGNmyC2qP4sENQLqirK9wa+0XHv9q+kzL7DBm9xCoImbHf33x/Mnx8amurIlqVyOSIAnUFcus9MLtxl/f5FsXJk+6yCzufc/wxqVXvvC0lgozS3624z6T3Gfc/T1zd3dvuduxjVQeKjeaz8078I6IoO4OMMaBHXjFTUSUNyswBNQcXu27rIO8nSsK45VRgG3ujoYsyAC5TDyzkxhh5UY/k0zgtlAZhXxrHxsEHNCe/xijaCrS4e9e+Pz1fQ+7Qcgl7y+XBgapfU9N6xDakvtju+3n5+deK8vytAIjw9aoXjjo5k0YbgAfJripUIXyXeg2gQ7wfgHJ8MxtRBs5MBKBdpE2oArMlUCA1dDrR7yn5IMAXevhwcGgSwGwHgHtSQb+TSCxh4iDOxQKfwOiEB3KBATUBSBEQFx64XiWmxgKBg6WU4KjySMGJMFDNMzvxqJAwhzP3WT9poJDVDyKaet61Nb16CoGCkGQ9rJ65ma9I00K1DfHOqFb5hOLey83l+eNKsja7zr82Y4ft3z65PfSWlIG4M/lBXYuPH05dDv55vwhgE0AB7+d+vj29NDEJaD2SNj01tJLX7a317adBxRBx+tji7/tX9gYjLUjQG3f0MQPFyc/WQVmCCGg6DGgAaBRBfQcSOU/n5oBH/XfHGBQ4JRq5A5IWx73SeLhogAAAABJRU5ErkJggg==',
        right: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACmUlEQVR4nGWTT4iWVRTGf+fce9/vj6Nf4/hnRlEERVcuAsFw0SKRRAhSiBJXgiQiqNRCwc1AC6FsihYVtrKYWShRkkSudBNFCPkVrSSmwj/ziVoa8c3Me99zXLzfTJTP6p57D8957nnOgf9DAUECXCxgJsGdAvmWIAF9Khv5TxAChcWJpsuO6QOXtw4v29wmOzZ3P2+Y3Nm9XT3qWvRDZPxpAkWWWXp/ev/lY8uXbwfpQGvw5sDsn/jjXxn7dOf5Ho8PDm5rgpSSpOzvTL/21Zsja3bNS1tURSL3ARWIjuGZlfD37e/jxg93n38U+wdzzo6IAJz+7dVLnk/mOR8391mvcc7dT7j78dL93Xl3d6+qqnxw6ppH+EBVUXcHWDXGSN3A4wINyEB/HzAELBV4IwFQAX+8vMUyjJkZKkG0Q7MoUgIDnqm/3VoN7RXAPaAIAPT79fHZ50Z1tFiXUiCoV/7e9b2Th2zdthz6FMzUBBs2wfBCyVwBEFvAKo27Om4/7596qaz4XIHO0tCICLWCCaAHN6/Cw3FqJ/5SOFOSSvAuXDkCK6qmAsMRKDNWmxIc5oG3HaJBqRCkNquX4HQeWB4G0igVcF0YB/fa2EpgNoDZQmKNuQh9Bwev3bN/h9PAipDd3RBAK6whuWowj/giubVCxsEGRRWwbJVZy7Le60aRSgGskKx3f4x+64fCE4YKBNBeN1rLsrlZrR5WjjQ7Gh/2musv7P7ym18+nqUNVe+7OPTZ9qk0teOTmd+vKEvgxs1J1k4+fzHc+alIjSEFRgH2Tr3w1oNtnU0XgAi8cmnPRH99Y/VHSK1ziDj+9YtnyzbFUSBsbKw998Wes/8Ahxc6cABZXB2AIyISFvdMVYATMcZBTAJeB3gCWn4PpFt1S94AAAAASUVORK5CYII='
    },
    inky: {
        up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzklEQVR4nJWTzWtTURDFf3fyXtqSCKa1GsWPTRG6UdSVa/8pV+JK6kYh4EoIIrgRuhAMgitdWGqhdtFWq0IoIsVqQUSSZ/Jy73HxkvBin6ADA3fOnXOGmbkXCqwEBrSATWAbeGhFiYeIpdgBDY7OtfiUpHgJSbz7kjBVfQrciO3vUo7aqQe0BxlJEiF4QvDZWeLNZzF15JYrJB+bb7KZiMuDHhd8OhYZ+Vmfcs2nbOyK8vRt54YyBlCqNPja1bL3KRY8Jj3JkVu/JJCO14N/5H3K1q6Amy4rDWCvCMH/8D4NA6kfJJ8TkKQkSApS2/uUrgQsA1jknDFbH+CcfQRcCWIHO7n+vgHTLqu2A+CBciWNsz7Kz9nv90bDakv68Gf/kg4kreSH+3YvAe4Dtj8GC4iFHoLnpwSsGdD5lzdyyPoC6NpoEf9v2Q5stAcAQhhM5IQwKMRyZhACAFLALEKajPMYMI6VZRnY/PAmYuHiaw76WUvfMWZmX3LizApyGba9B4tX1jGLqABQg3K1yepWh3MLTYOIk6fvst7uMVe/5xj+zPOLj1l7n1CtXY8h5tLVZ7zY6ABLWGQOuOMgAnDOGdBgcrjxEBsNbAZYMov4DRt5NkCBfZ1GAAAAAElFTkSuQmCC',
        down: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB10lEQVR4nIWT3WsTURDFfzP37hrTD1QM9hPTYlP7ov6hvgcsvhSUUpD+EfUpRKEi+CRUkYgFrTakabK5d3zYTbLRiAcG7s6eM3vmsBfmQMCRpi1uLFyQVi+oVE8UdB53Bk5EcZWXrNbbXIUMM8PMuBwNqN1/C5XnDmSu2IOyvnXMsBDNq64ZtbUjnRkigogoK5u5OISMGMNf4hAyQuFqe+/QqU6GCEn1BYOC9K+vlwf1zPDJviMPxsiudkks/jekMW5aZJQ9jIA65xwbOxERRUR/AudzNFZUsbay3YhevYPqcpss37ljU8SS7R+l/kczI8ZAP2SIPxFIuthwEeDaLOpodO2cS1XVj1OKZjGEMDSzOPS+sjh2IXKuOOmOnb0GFm6DW4J3JfttIEkt1moWW2b5ugFAekDybSblTTM25qS/YsZucY4xMDIDd+Yp/6Jmkc8yfY5xBICq52uJM4UqECcvRHRCMIuoelT9jKjMyRvpILdlRuPJKd8Lmz0zlm61uHOvRVb0OmbsPD6drAW/YGH5Fe1PPbYaBykkrNWbvO8MWK8fOBABpb53yIfLPndXnzpIePDomDdf+qSLR4hzCtJU8OSBKOizP66vR/y+Ux33EnBN71P5DQllVXyQma9lAAAAAElFTkSuQmCC',
        left: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB4ElEQVR4nH2SvWtUURDFf3Pf24+siYkYFLRRizSaSiVi7V9g7b9hpSgogmIhipVbC0IwQrTQRgQ/CiMxCbsgxi9iIMHGENndrG/vPRZv3+atbDIwMHM4Z+65946xc1SByW791cwuSNIufIiiCOASFB8z/71FU2JTor7miSpPgKtdzgAxgCtdZ2lVSGmG4AnB9/r6uijsuRlh/WLnHLjyFea+CO8TOp12T5Rlp9PG+4TlX6JYuuGcS8VmBnCRd3VNe5/U8id284Okl5kj7xNq6wIu501Mz/xck/c+kaRaTvxc2/FUSh2G4IFnABQKDtzehzYksc8nG5spuefgqDRyJMUa2YBEwsrTUeqeO7z/1uBk8CBtbXSJWQ5LVNIBH/OPu7jSAB4AvOZ3Cs5sSZv/P56kuSDV81gInqYEzMdAky0Po47zpcFffNoGgH8BaDnAMLfDau0S6m5ArwSQQj9JYSCWC9ebJgUsZyXrzVyfqL/vOGCUYQPnYianPrP8J2M6Dh5eYv+BBXx38GoTTkx9wrmYIQDGAG7zttbgzLlXDsqMjV9j4UebieOzBpGBcWziEYsrLcYP3SpCiVNnX/BmqQHcJ45jKJTvAiMAzswwqwLF7XtaDK5q2ZWhgovvRVHMP7z+WsD4PpRYAAAAAElFTkSuQmCC',
        right: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1klEQVR4nI2Tu4tTURDGf2fOvUlMcAXjigpZFfGBlaAI+h/4T9nYCClslFiJLlhZbJXCJmyxrs91bdyXYLFE8UGURaImN3PG4t6blxH8YIr5+OabOXPOcUzBpeECPAAuZnRb4FqAMK2fgPce4Aa+2GTjY5dgRt+M9m9lbv4xcDuOvZtdDEixXOf9F8MsjRCUEHSYf1KjWrvv00GnEJdusvPNUE1QTYZFeagmDAY92j+NucP3GJo4l4799msqCkFbZrY7bWBmr0LQF6oJux3Dx3dlrP8SGhTVpGkjPBsrXs84VU2e7CUKPAVAxDl86RH9dMxOJtx/0ozKyCAHhzQBM/yJ5ShCABbZ+NDLl7WcCavHzCiNDLYzXiIzjgdlM+lRLLYAXrOXbTwTr5rZ1owd7JjZio1pkU4EdOlPXsjVf7yTM9OEoyuAzLrV/4KJyAQRwuCvfBY3BgECBpgFRKKRe5aLRJiFCS7P0YEAB6kAIhHnLq+z+TkzcMKR2nP2lVf47tJJOwPh7IU1yBtZFaBO680PLl1pFqBA5cB1Xm73OH1+qQBeAOaPNlh794vawp0CxCycWmR1q0up8pBsDXVwZUi/MtAACvlpXHrUhkTiMyoCbvk4dn8AgDJfwO8SCRMAAAAASUVORK5CYII='
    },
    clyde: {
        up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACj0lEQVR4nG2TT2hUVxSHv3PunZfJm5CMiSGSaigxUDSIFv9sutBNQSiuCl1YpO2iUdAiFURKRSUBiyC6EFEsLrJQEHHdlXShiwYpVVBQpJuaVkZDdDI248x7954u5llH8MCFy3fO+fG799wrvCfUJxLz9mXgwwL97rw/HPL8feVvw3sPcLwPrv8z1W92ELPvscdfpS2Fq8BBEXmnR7q3vdjJh1OjP4wNLmMjLyOlItNGWRjk7t8pH8/OHxKRs2bWZVk9Kcw8+Ha97RgN2eRA3rKZCbPTmJ3B7Og2+6Anb32+NmR3vh4JwHfOuUJdBAc//rV/2MLS7YxqDGBmTx+anfdms8O28OcTA7OBiRhC45fszu4+A/aKCN7MCLB1zaARKxt4VRPVAPR+BNEgKzM0vpqXDXAV0RjWtTetaHpg0szwmnjSdv6aDOAplaS/ONhzMMCaQGCgr2M5SE1DVJQQxDk0tvOLj6Yqu2xkIerspx5qQBOubIdmgPoCXPuko5k/wl3amZTWZfHu7upUCOGYBzaMVpZTKxGpPYEL46AlqNc7MwrA/Bz8XIXMYGkJW0EcqzRSYNwD/xIUYgAFGssd69o16AgsFoIFb0UFQlMB/3/CigZfNFuxKNgbMQMRA3CFnoMAMaHzVouiWCaPZXKsYHTVFFYUyLCA9RB1UTyuQ80Ttea8PhdvJSLa4foCHxPymLsIZAoMURa0lvrJs/63xccJpCDzFU1PhptjP9ltedarpPDgj0q+5Vwy5+tpub/8WoEqwIm5L4cbmwfcDSAZ8kzf/2ZVa1S5WNyi29jvbtzbs7qZIgeA8merSrd+/WJlHdiHcw6PnwZ6O/9CRXFnQN/MARHpcXCqC1UVPSIi/AeSmwjoBKJbfAAAAABJRU5ErkJggg==',
        down: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACbElEQVR4nHWSu2tUYRDFfzP37t27DzbZyOrGRyISBIPaaKNNChsbKxEEKx9EEEUUUkgKEaKCRAVfUUNasU7tH5BCQaIiEl/EmEgIebnZzd29+41FEl2DDkwz35wz35wzwv/jOrAHqAHTwDnABLCGJr8RIQJmXAJ2vz2ROt65YTmNMyajLDsGS5kqfAKu/YVZN/XK2KncjY6NFWit4ZLEABKj8l31x3yK7QNLdyO4/C+C3s+n833t++diczivTICtdgjUU1QRiN7kgpaBxXsRXGwk6Jk41XSrdd9CLCVUQPHW/c2BGc4yuPKHrJ+7X+o36FnToGvzlrIzAUl6itZXpFtTS4BQEUMtdi5TjB1wCEBX30tSFSURwtmXcGEaCh3gVsG5FrjwaSWbNyHVuqZhcW2DxxPdmSX3IFG3yoj9iWmzJ3mze56ZfWioj5l7lKtXzjdVgGEFDmxpKqcJahB2NixdgIQPosDOhnoHBEbYshACXQosEgs4hegLbXtBUlCerYBfBa8O5Sn8Ngi2AqVxRGOlqgA/FfBRD5yDwaMkPwPLkH5yBOYWIHIweJjMNwi/A0+PQVQBLwBQ/7fKMdjyRzfWW1AsC/IVBzEKWhv1F/raQWLMTToikBUDnA/EmMNCnM4GPvkZYAYDp3PqYx7WVHOSHVc8kPlAXbYaC3UViBVoIanofMbfd9tGZ95nIQCZzWt7n3vVfK02IlN5JQC+ZOm8yWudSvqEYFAAuPPuZHHpYDMvgDAHV8e7i9GuFMOAB0hRGJo4U6xtUx4DQUeCZ+9PFys+PF/zph/INNzdABA0eKfA0CohQAJ4CMgv7wr9rCokR+cAAAAASUVORK5CYII=',
        left: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACk0lEQVR4nGWTT4jVVRTHP+fcM783b97TpzNqjDMaZTCFZBJCbqRN62jbRhGrhWW4axM0BrNIEJpwCoUGghZtbOWmbWoUEU0Jok8xCMU/U6O+p7557917T4vf82V54HsvF77nfr/33HPg/yECqgp8BzQHWEQVEXmCbv85mEmM8dhG9x3XDjVeLcbuGaos/92YnD55Z6qPnDOzj2OM/+o9rt1Qjt9+t3Kw2NCFBriQEZAeShv+vLme50+0jnTUZ8kZAH20roP5y4emDtqLxLyWSA+ki8oqSmHkp0Kc3n4nNg/UPgpZPhw+R0QQmLv+wYyn9Fs/5+XkX25zP0qJb15w97Z793fPx4uUFuhf3DfuwOHHa3Lq6vmfU0qp7+7uvuy+YO6fr3Hv3PJh3P3B+1/Q8fdxYB5ArQhSlyrP7tylYS087AJsgELhxiTS2MTGmYFMYxsSUVxQEDMTjb301aV31r++o+aZh2rBAFqQUpnUg/TIafcaoUPhz3n+dd/42zHGIwo8s3n0pi3NzpBuXaUS2vD1bmglqDfxT/ewcqENqQmLr4GDV8hbK3dHga0GdHCgehn9djskg/v3y/8RQM7C4iT0EjxYLZ1k6PcN6HUMUEShl0tCoIQPsAqsPhhcBqRyF8kAQQFFHQTyGHGYDOQKMVeIQzeAG2UHBYaNFMmOF2RdKUuIlkS9LaYrZj5CxgbKbdQD2aMDJAXWURj6V2EvzY/80vqjBjWQ63VdM8f3W47qT7JSU6pw6UI9v7IwuhRa1aJWcYA6wNzS3on27gk5DVSmRmTuylubO09XWQQVsPDyhJxu7p/o1k0Og1bfmLYfz7y5qQ28h5kRkE9AxgBCCAosgIbhlAmjAp+VUw6g4wKzqso/UZISjmIm/qIAAAAASUVORK5CYII=',
        right: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVR4nG2Sz4uVZRTHP+c8z33vfe+90zg/dEaZULlUEgQa1NZ/wIXQtl8bN2HRJlq4CwRhxDEZBYtpF9QiaSHtWgiioBthwCjMizk23hrTxmruve/7nNPivd7IOnB4OHCew/mezxeeDhEQkRpczODnGqzV4RohBET+2/6vQlXqxnIT27/23tT+fPL3Jm54f8L2Lv157W6yLrXa61YU9j8DVKZFz99/d/JIbfYR5Anq4I6Jo2xmsAm7Tw2//sl4DTAABYgxyjR2vnc0PxI6D0qboySfgj7IAGUI1h6Wtk/LO8f2HH4WLsQQVMaaYal/dNrTMoV/Muvut9y97/7lPvdF3E/ivtJx94ee0kaRFg/4BHyO6nj/r+xDUjpL4eX3Po4/NtzPTbkvB3fvubt7SqnodbsJ9GolPIjOoCqeKSiEDgCNXSDtGbg/A5kDOwAI22Bu7x6dknmyKFE9+YU77zxzyHcNTYcWsZsAtCchA3CHZMA9HCDX2Mlg7f1tr2alX1dgodV8FAlACXx6EMrv2Fh9wODMy9D+ER4DK68g3MW7t7m1+BzN/KYOYCECA0wABwc2H8K5lyBTsGLECfhtHc52KvJhCASMNIgVSq+afAR2kKCf/nHKk/yrgBI8x4SKQTXfq8cyyvEnBWtQWp1ybDcBa45qDzwxkgF4humvWt1CwCOmPaKuS/SAEcADpr+ESI3RwTAFZmmArtfji6fl8r3VFrRAehO64wTfZif8G++2lTps3Z7Q50/rJek2lNxIsB3g+JU35h8fmA4XQbM2fLD65sLWC634BQQFYQ7O/PDWzmJnXZZA4+4GKzfent9qwWeoKlD7CDSvRCkCp5Rq0crtQSK1jzWOvKsaFT0ZY5S/AWqkD0QparkoAAAAAElFTkSuQmCC'
    },
    eyes: {
        up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAj0lEQVR4nO2RsQ7CMAxE79K6aQCJbuztb8Af8P8rX8HaYzCChgbanZ5kyYqezjkb2MR3K02eOUdzJiBwhBCsgPWE7RcmD9YfBsCgp9zdS5Kul/Mpn50z95tzdSkAAKSYZp/7ZDzKF6XYxIUUvw12bbvKAF1VMQCvXUhSydXIjDk2kcDkjL4kF1k+4xrmH/UA3stP0Iur7f8AAAAASUVORK5CYII=',
        down: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAm0lEQVR4nO2Ryw3CQAxE35jdEBFRAycEpUAJ9A81EBIlcMjPgazEHUbyxX47I3vhLwBiDDydUpxnQt8zgG2+kQeD1A2cTJo3JIqVzV29jod9NrCX82m3xLRt27wHTYlmY+SjquslRpJ9ZVAmDKC/wf0K0lQAuFtWddn0a88ZgAwoKKx7MdRnShxdF5hAHIc5t+Q3rp2BoRT2c3oBFX9xUA7hwq8AAAAASUVORK5CYII=',
        left: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAuUlEQVR4nO2PvRIBQRCEu+fOIaD8RkoRKCGZwNt4fwKFcutnW2LP1tWdF6CjmdmveruBvxgGSSqOJKvgmEnM6CWYxS7hkYSVbuWdABIC9pTkI2cAeHiv3WazDPsiazWeFczDS0buQQLl0CfnrmHOb10LDHkoJxtV1cXZubyohCyyH36tVuji8vvHwJI6DltMhzNM2jqpUJqmaEdMD8YV5h3l0vHNrAf9zrjV/ARQpLrPYmYBZrWpfkwv2KllZq2VZYMAAAAASUVORK5CYII=',
        right: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAArklEQVR4nO2RsQrCMBCGv0vaUq2gIlJxEBEX6eLi5jv4/g8h0qViIpxT27S0i3M/COTCx5/cBSYAiIxBA8a8IcfEIhiRjmh7tQHi3pkAVnqpIfs4sbX8KIrdmGc6qfJCBETA+XlzZeWc73r1etIJgHXw7KjZV957Btn0A8K+26bf7vMd88izmbnl+UpVtVRVrVSvnJeLICAFkiRu51WqHjlkd05bAC7Gpv9+4wT8AASmiluJhbS5AAAAAElFTkSuQmCC'
    },
    scared: {
        imgDate: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADCklEQVR4nFWSX2hbZRjGf993vnN60qSNXWva6JpR7f5km7qrWrVUXYt2HdOCk2FBoQiDsivxRmU3XggiKIIIuxgOpxeyKsL8A8IoaJVNrMy4Mant2qZbMxKX5k/TmJ6cfJ8Xyao+8PK8F89z8bzPK7gDIcHo+t42GGbwmzk8vwJCIi2HH4d7KfxcAgFCbGkFANIB7cH2l3exc+IVCHfRtn8Mzb/IJ6YQpSxzp94h9enSHY9CyLq5Z3If8ddO0xrrpwr4/B/tDz2PDbj37EW5x1k5PYeQSIyBHcfjxN84QzDWz0a1jNY+1n/MFqC1z0a1TKhnkH0nP2L7xE6MQSAkPH7lPJG9R6j4FXzlstkwBQADlBscAKiWabGbWZ39hJm+lxRGg59PgdFUpdrWDf1xWCvBpV8AG548CIEAXEiAl5aKmtF42RsYgyK4x8EKtSOFZMPo8SfggxfqJ7CPgAjA9Ov1JIffh2/PC0lYSJy2KKHdjmLw0gJN4W48o1FS3S7UxVfSdTYa0lXotKFQAiyp8IxmW98EAz88LBgtpnBaovU6G9kdoAZ4jaKdBnuAbgxAJTuvMEajgHXts1nzcJWLKyQ1YN2vANCqXCRQ1j5ezaNJKlosB6NrEltIbsKJ5zLXrp8rrr44ml1gyWiaSunfPs4tz54p3MAq32bZ6MljxdXr59ZvTR7NJ0kBtrQEQ7nlN09IVS7mkn/mOnp778olH3nw7t1/ZQs3f5q3bNuynIE4tIbc8MU/iqnFW8GOAztKmU3jht869XdOIYRMZyuFzy/H+jO/Ctl1wN+MdRZTiRU7cPbLth4UNDnF1T1dpczZ75vbM4lgZPaxYGSkN30VI6TgUH4FK9xNevpd2iL307J/jIzRmHySyldvo4HmZ08iWu8lIiTFxBS57ArRg6/ip6/C4VKapy9/Rug+m8gzXYzOX2DcGIYSU1uvPHTta8aN4dDcd3Q81U5wl8PI718wkl2A4eRFQg+4W+LosRhH1xZ5dPo9hAJhw8DMh4ytLdI5Ft3ShfuCDC/N/AMdtzXsl7IlxgAAAABJRU5ErkJggg=='
    }
};
const WALLS = {
    horizontal: Array(GRID_WIDTH + 1)
        .fill(null)
        .map(() => Array(GRID_HEIGHT + 1).fill({ active: false, id: '' })),
    vertical: Array(GRID_WIDTH + 1)
        .fill(null)
        .map(() => Array(GRID_HEIGHT + 1).fill({ active: false, id: '' }))
};
const setWall = (x, y, direction, lineId, color) => {
    if (direction === 'horizontal') {
        if (x >= 0 && x < WALLS.horizontal.length && y >= 0 && y < WALLS.horizontal[0].length) {
            WALLS.horizontal[x][y] = { active: true, id: lineId, color };
        }
    }
    else {
        if (x >= 0 && x < WALLS.vertical.length && y >= 0 && y < WALLS.vertical[0].length) {
            WALLS.vertical[x][y] = { active: true, id: lineId, color };
        }
    }
};
const hasWall = (x, y, direction) => {
    switch (direction) {
        case 'up':
            return WALLS.horizontal[x][y].active;
        case 'down':
            return WALLS.horizontal[x + 1][y].active;
        case 'left':
            return WALLS.vertical[x][y].active;
        case 'right':
            return WALLS.vertical[x][y + 1].active;
    }
};


/***/ }),

/***/ "./src/core/game.ts":
/*!**************************!*\
  !*** ./src/core/game.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game),
/* harmony export */   determineGhostName: () => (/* binding */ determineGhostName)
/* harmony export */ });
/* harmony import */ var _movement_ghosts_movement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../movement/ghosts-movement */ "./src/movement/ghosts-movement.ts");
/* harmony import */ var _movement_pacman_movement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../movement/pacman-movement */ "./src/movement/pacman-movement.ts");
/* harmony import */ var _music_player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../music-player */ "./src/music-player.ts");
/* harmony import */ var _renderers_canvas__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../renderers/canvas */ "./src/renderers/canvas.ts");
/* harmony import */ var _renderers_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../renderers/svg */ "./src/renderers/svg.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constants */ "./src/core/constants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







/* ---------- positioning helpers ---------- */
const placePacman = (store) => {
    store.pacman = {
        x: 0,
        y: 0,
        direction: 'right',
        points: 0,
        totalPoints: 0,
        deadRemainingDuration: 0,
        powerupRemainingDuration: 0,
        recentPositions: []
    };
};
const placeGhosts = (store) => {
    store.ghosts = [
        {
            x: 26,
            y: 2,
            name: 'blinky',
            direction: 'left',
            scared: false,
            target: undefined,
            inHouse: false,
            respawnCounter: 0,
            freezeCounter: 0,
            justReleasedFromHouse: false
        },
        {
            x: 25,
            y: 3,
            name: 'inky',
            direction: 'up',
            scared: false,
            target: undefined,
            inHouse: true,
            respawnCounter: 0,
            freezeCounter: 10,
            justReleasedFromHouse: false
        },
        {
            x: 26,
            y: 3,
            name: 'pinky',
            direction: 'down',
            scared: false,
            target: undefined,
            inHouse: true,
            respawnCounter: 0,
            freezeCounter: 20,
            justReleasedFromHouse: false
        },
        {
            x: 27,
            y: 3,
            name: 'clyde',
            direction: 'up',
            scared: false,
            target: undefined,
            inHouse: true,
            respawnCounter: 0,
            freezeCounter: 30,
            justReleasedFromHouse: false
        }
    ];
    // reset extras
    store.ghosts.forEach((g) => {
        g.justReleasedFromHouse = false;
        g.respawnCounter = 0;
        // Set different directions to create an asynchronous motion effect
        if (g.inHouse) {
            // Distribute the initial directions so that everyone is not synchronized
            if (g.name === 'inky')
                g.direction = 'up';
            else if (g.name === 'pinky')
                g.direction = 'down';
            else if (g.name === 'clyde')
                g.direction = 'up';
        }
    });
};
/* ---------- main cycle ---------- */
const stopGame = (store) => __awaiter(void 0, void 0, void 0, function* () {
    clearInterval(store.gameInterval);
});
const startGame = (store) => __awaiter(void 0, void 0, void 0, function* () {
    if (store.config.outputFormat == 'canvas') {
        store.config.canvas = store.config.canvas;
        _renderers_canvas__WEBPACK_IMPORTED_MODULE_3__.Canvas.resizeCanvas(store);
        _renderers_canvas__WEBPACK_IMPORTED_MODULE_3__.Canvas.listenToSoundController(store);
    }
    store.frameCount = 0;
    store.gameHistory = []; // keeps clean
    store.ghosts.forEach((g) => (g.scared = false));
    store.grid = _utils_utils__WEBPACK_IMPORTED_MODULE_5__.Utils.createGridFromData(store);
    const remainingCells = () => store.grid.some((row) => row.some((cell) => cell.commitsCount > 0));
    if (remainingCells()) {
        placePacman(store);
        placeGhosts(store);
    }
    if (store.config.outputFormat == 'canvas')
        _renderers_canvas__WEBPACK_IMPORTED_MODULE_3__.Canvas.drawGrid(store);
    if (store.config.outputFormat == 'canvas') {
        if (!store.config.enableSounds) {
            _music_player__WEBPACK_IMPORTED_MODULE_2__.MusicPlayer.getInstance().mute();
        }
        yield _music_player__WEBPACK_IMPORTED_MODULE_2__.MusicPlayer.getInstance().preloadSounds();
        _music_player__WEBPACK_IMPORTED_MODULE_2__.MusicPlayer.getInstance().startDefaultSound();
        yield _music_player__WEBPACK_IMPORTED_MODULE_2__.MusicPlayer.getInstance().play(_music_player__WEBPACK_IMPORTED_MODULE_2__.Sound.BEGINNING);
    }
    if (store.config.outputFormat === 'svg') {
        while (remainingCells()) {
            yield updateGame(store);
        }
        // snapshot final
        yield updateGame(store);
    }
    else {
        clearInterval(store.gameInterval);
        store.gameInterval = setInterval(() => updateGame(store), _constants__WEBPACK_IMPORTED_MODULE_6__.DELTA_TIME * store.config.gameSpeed);
    }
});
/* ---------- utilities ---------- */
const resetPacman = (store) => {
    store.pacman.x = 27;
    store.pacman.y = 7;
    store.pacman.direction = 'right';
    store.pacman.recentPositions = [];
};
const determineGhostName = (index) => {
    const names = ['blinky', 'inky', 'pinky', 'clyde'];
    return names[index % names.length];
};
/* ---------- update per frame ---------- */
const updateGame = (store) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    store.frameCount++;
    /* ---- FRAME-SKIP restored ---- */
    if (store.frameCount % store.config.gameSpeed !== 0) {
        pushSnapshot(store);
        return;
    }
    /* -------- pacman timers -------- */
    if (store.pacman.deadRemainingDuration > 0) {
        store.pacman.deadRemainingDuration--;
        if (store.pacman.deadRemainingDuration === 0) {
            resetPacman(store);
            placeGhosts(store);
        }
    }
    if (store.pacman.powerupRemainingDuration > 0) {
        store.pacman.powerupRemainingDuration--;
        if (store.pacman.powerupRemainingDuration === 0) {
            store.ghosts.forEach((g) => {
                if (g.name !== 'eyes')
                    g.scared = false;
            });
            store.pacman.points = 0;
        }
    }
    /* -- ghost respawn -- */
    store.ghosts.forEach((ghost) => {
        if (ghost.inHouse && ghost.respawnCounter && ghost.respawnCounter > 0) {
            ghost.respawnCounter--;
            if (ghost.respawnCounter === 0) {
                ghost.name = ghost.originalName || determineGhostName(store.ghosts.indexOf(ghost));
                ghost.inHouse = false;
                ghost.scared = store.pacman.powerupRemainingDuration > 0;
                ghost.justReleasedFromHouse = true;
            }
        }
        if (ghost.freezeCounter) {
            ghost.freezeCounter--;
            if (ghost.freezeCounter === 0) {
                releaseGhostFromHouse(store, ghost.name);
            }
        }
    });
    /* -------- end of game -------- */
    const remaining = store.grid.some((row) => row.some((c) => c.commitsCount > 0));
    if (!remaining) {
        if (store.config.outputFormat === 'svg') {
            const svg = _renderers_svg__WEBPACK_IMPORTED_MODULE_4__.SVG.generateAnimatedSVG(store);
            store.config.svgCallback(svg);
        }
        if (store.config.outputFormat == 'canvas') {
            _renderers_canvas__WEBPACK_IMPORTED_MODULE_3__.Canvas.renderGameOver(store);
            _music_player__WEBPACK_IMPORTED_MODULE_2__.MusicPlayer.getInstance()
                .play(_music_player__WEBPACK_IMPORTED_MODULE_2__.Sound.BEGINNING)
                .then(() => _music_player__WEBPACK_IMPORTED_MODULE_2__.MusicPlayer.getInstance().stopDefaultSound());
        }
        store.config.gameOverCallback();
        return;
    }
    /* -------- movements -------- */
    _movement_pacman_movement__WEBPACK_IMPORTED_MODULE_1__.PacmanMovement.movePacman(store);
    const cell = (_a = store.grid[store.pacman.x]) === null || _a === void 0 ? void 0 : _a[store.pacman.y];
    if (cell && cell.level === 'FOURTH_QUARTILE' && store.pacman.powerupRemainingDuration === 0) {
        store.pacman.powerupRemainingDuration = 30;
        store.ghosts.forEach((g) => {
            if (g.name !== 'eyes')
                g.scared = true;
        });
    }
    checkCollisions(store);
    if (store.pacman.deadRemainingDuration === 0) {
        _movement_ghosts_movement__WEBPACK_IMPORTED_MODULE_0__.GhostsMovement.moveGhosts(store);
        checkCollisions(store);
    }
    store.pacmanMouthOpen = !store.pacmanMouthOpen;
    /* ---- single snapshot per frame ---- */
    pushSnapshot(store);
    if (store.config.outputFormat == 'canvas')
        _renderers_canvas__WEBPACK_IMPORTED_MODULE_3__.Canvas.drawGrid(store);
    if (store.config.outputFormat == 'canvas')
        _renderers_canvas__WEBPACK_IMPORTED_MODULE_3__.Canvas.drawPacman(store);
    if (store.config.outputFormat == 'canvas')
        _renderers_canvas__WEBPACK_IMPORTED_MODULE_3__.Canvas.drawGhosts(store);
    if (store.config.outputFormat == 'canvas')
        _renderers_canvas__WEBPACK_IMPORTED_MODULE_3__.Canvas.drawSoundController(store);
});
/* ---------- snapshot helper ---------- */
const pushSnapshot = (store) => {
    store.gameHistory.push({
        pacman: Object.assign({}, store.pacman),
        ghosts: store.ghosts.map((g) => (Object.assign({}, g))),
        grid: store.grid.map((row) => row.map((col) => (Object.assign({}, col))))
    });
};
/* ---------- collisions & house ---------- */
const checkCollisions = (store) => {
    if (store.pacman.deadRemainingDuration)
        return;
    store.ghosts.forEach((ghost) => {
        // If the ghost is eyes, there should be no collision
        if (ghost.name === 'eyes')
            return;
        if (ghost.x === store.pacman.x && ghost.y === store.pacman.y) {
            if (store.pacman.powerupRemainingDuration && ghost.scared) {
                ghost.originalName = ghost.name;
                ghost.name = 'eyes';
                ghost.scared = false;
                ghost.target = { x: 26, y: 3 };
                store.pacman.points += 10;
            }
            else {
                store.pacman.points = 0;
                store.pacman.powerupRemainingDuration = 0;
                if (store.pacman.deadRemainingDuration === 0) {
                    store.pacman.deadRemainingDuration = _constants__WEBPACK_IMPORTED_MODULE_6__.PACMAN_DEATH_DURATION;
                }
            }
        }
    });
};
const releaseGhostFromHouse = (store, name) => {
    const ghost = store.ghosts.find((g) => g.name === name && g.inHouse);
    if (ghost) {
        ghost.justReleasedFromHouse = true;
        ghost.y = 2;
        ghost.direction = 'up';
    }
};
const Game = {
    startGame,
    stopGame
};


/***/ }),

/***/ "./src/core/store.ts":
/*!***************************!*\
  !*** ./src/core/store.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Store: () => (/* binding */ Store)
/* harmony export */ });
const Store = {
    frameCount: 0,
    contributions: [],
    pacman: {
        x: 0,
        y: 0,
        direction: 'right',
        points: 0,
        totalPoints: 0,
        deadRemainingDuration: 0,
        powerupRemainingDuration: 0,
        recentPositions: []
    },
    ghosts: [],
    grid: [],
    monthLabels: [],
    pacmanMouthOpen: true,
    gameInterval: 0,
    gameHistory: [],
    config: undefined,
    useGithubThemeColor: true
};


/***/ }),

/***/ "./src/movement/ghosts-movement.ts":
/*!*****************************************!*\
  !*** ./src/movement/ghosts-movement.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GhostsMovement: () => (/* binding */ GhostsMovement)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/core/constants.ts");
/* harmony import */ var _movement_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./movement-utils */ "./src/movement/movement-utils.ts");


// Constants for ghost behavior
const SCATTER_MODE_DURATION = 7; // Duration of "scatter" mode in seconds (frames)
const CHASE_MODE_DURATION = 20; // Duration of "chase" mode in seconds (frames)
const SCATTER_CORNERS = {
    blinky: { x: _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - 3, y: 0 },
    pinky: { x: 0, y: 0 },
    inky: { x: _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - 3, y: _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - 1 },
    clyde: { x: 0, y: _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - 1 } // Bottom left corner
};
// Global status of game modes
let currentMode = 'scatter';
let modeTimer = 0;
let dotsRemaining = 0;
const moveGhosts = (store) => {
    // Calculate the total number of points remaining to define the behavior
    dotsRemaining = countRemainingDots(store);
    // Update game mode (scatter or chase)
    updateGameMode(store);
    for (const ghost of store.ghosts) {
        // Special logic for ghosts inside the house
        if (ghost.inHouse) {
            moveGhostInHouse(ghost, store);
            continue;
        }
        if (ghost.name === 'eyes') {
            ghost.scared = false;
        }
        // Main movement logic
        if (ghost.scared) {
            moveScaredGhost(ghost, store);
        }
        else if (ghost.name === 'eyes') {
            moveEyesToHome(ghost, store);
        }
        else {
            // Choose behavior based on current mode
            if (currentMode === 'scatter') {
                moveGhostToScatterTarget(ghost, store);
            }
            else {
                moveGhostWithPersonality(ghost, store);
            }
        }
    }
};
// Function to count remaining points on the grid
const countRemainingDots = (store) => {
    let count = 0;
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT; y++) {
            if (store.grid[x][y].level !== 'NONE') {
                count++;
            }
        }
    }
    return count;
};
// Updates game mode between "scatter" and "chase"
const updateGameMode = (store) => {
    // If Pac-Man is powered up, do not change the mode
    if (store.pacman.powerupRemainingDuration > 0)
        return;
    // Increment the current mode timer
    modeTimer++;
    // Check if it's time to change mode
    const modeDuration = currentMode === 'scatter' ? SCATTER_MODE_DURATION : CHASE_MODE_DURATION;
    if (modeTimer >= modeDuration * (1000 / 200)) {
        // Converting to frames (assuming 200ms per frame)
        // Switch between scatter and chase
        currentMode = currentMode === 'scatter' ? 'chase' : 'scatter';
        modeTimer = 0;
        // Reverse ghost direction when changing mode
        store.ghosts.forEach((ghost) => {
            if (!ghost.inHouse && ghost.name !== 'eyes' && !ghost.scared) {
                reverseDirection(ghost);
            }
        });
    }
};
// Function to reverse the direction of a ghost
const reverseDirection = (ghost) => {
    switch (ghost.direction) {
        case 'up':
            ghost.direction = 'down';
            break;
        case 'down':
            ghost.direction = 'up';
            break;
        case 'left':
            ghost.direction = 'right';
            break;
        case 'right':
            ghost.direction = 'left';
            break;
    }
};
const moveGhostInHouse = (ghost, store) => {
    // If the ghost is being released, allow it to leave the house.
    if (ghost.justReleasedFromHouse) {
        // The ghost can only leave through the door, which is at position x=26
        if (ghost.x === 26) {
            ghost.y = 2; // Door position
            ghost.direction = 'up';
            ghost.inHouse = false;
            ghost.justReleasedFromHouse = false;
        }
        else {
            // If not in the door position, move towards it.
            if (ghost.x < 26) {
                ghost.x += 1;
                ghost.direction = 'right';
            }
            else if (ghost.x > 26) {
                ghost.x -= 1;
                ghost.direction = 'left';
            }
        }
        return;
    }
    // If the ghost is in the process of respawn, just decrement the counter
    if (ghost.respawnCounter && ghost.respawnCounter > 0) {
        ghost.respawnCounter--;
        // When the counter reaches zero, restore the ghost
        if (ghost.respawnCounter === 0) {
            if (ghost.originalName) {
                ghost.name = ghost.originalName;
                ghost.inHouse = false;
                ghost.scared = store.pacman.powerupRemainingDuration > 0;
            }
        }
        return;
    }
    // Vertical movement inside the house
    const topWall = 3; // The position y=2 is where the door is
    const bottomWall = 4;
    // If it is going up and hits the upper limit
    if (ghost.direction === 'up' && ghost.y <= topWall) {
        ghost.direction = 'down';
        ghost.y = topWall; // Make sure it doesn't go over the wall
    }
    // If it is going down and hits the lower limit
    else if (ghost.direction === 'down' && ghost.y >= bottomWall - 1) {
        ghost.direction = 'up';
        ghost.y = bottomWall - 1; // Make sure it doesn't go over the wall
    }
    // Apply movement in the current direction (discrete movement instead of fractional)
    if (ghost.direction === 'up') {
        ghost.y -= 1; // Move up in whole increments
    }
    else {
        ghost.y += 1; // Move down in whole increments
    }
    // If the move resulted in an invalid position, reverse
    if (ghost.y < topWall || ghost.y >= bottomWall) {
        // Revert to previous position
        ghost.y = ghost.direction === 'up' ? topWall : bottomWall - 1;
        // Change direction
        ghost.direction = ghost.direction === 'up' ? 'down' : 'up';
    }
};
// Move to "scatter" mode - each ghost goes to its corner
const moveGhostToScatterTarget = (ghost, store) => {
    const target = SCATTER_CORNERS[ghost.name] || SCATTER_CORNERS['blinky'];
    ghost.target = target;
    const nextMove = BFSTargetLocation(ghost.x, ghost.y, target.x, target.y, ghost.direction);
    if (nextMove) {
        ghost.x = nextMove.x;
        ghost.y = nextMove.y;
        if (nextMove.direction) {
            ghost.direction = nextMove.direction;
        }
    }
};
// When scared, ghosts move randomly but with some intelligence
const moveScaredGhost = (ghost, store) => {
    // Check if you already have a target or if you have already reached the current target
    if (!ghost.target || (ghost.x === ghost.target.x && ghost.y === ghost.target.y)) {
        ghost.target = getRandomDestination(ghost.x, ghost.y);
    }
    const validMoves = getValidMovesWithoutReverse(ghost);
    if (validMoves.length === 0)
        return;
    // Move toward target but with some randomness to appear "scared"
    const dx = ghost.target.x - ghost.x;
    const dy = ghost.target.y - ghost.y;
    // Filter moves that generally go toward the target but with randomness
    let possibleMoves = validMoves;
    // 50% chance to choose a completely random move
    if (Math.random() < 0.5) {
        // Choose any valid move
    }
    else {
        // Try to choose a move that goes in the direction of the target.
        const goodMoves = validMoves.filter((move) => {
            const moveX = move[0];
            const moveY = move[1];
            return (dx > 0 && moveX > 0) || (dx < 0 && moveX < 0) || (dy > 0 && moveY > 0) || (dy < 0 && moveY < 0);
        });
        // If there are "good" moves, use them.
        if (goodMoves.length > 0) {
            possibleMoves = goodMoves;
        }
    }
    // Choose a random move from the possible moves
    const [moveX, moveY] = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    // If Pacman has power-up, ghosts move slower (60% slower)
    if (store.pacman.powerupRemainingDuration && Math.random() < 0.6)
        return;
    // Update ghost direction based on movement
    if (moveX > 0)
        ghost.direction = 'right';
    else if (moveX < 0)
        ghost.direction = 'left';
    else if (moveY > 0)
        ghost.direction = 'down';
    else if (moveY < 0)
        ghost.direction = 'up';
    ghost.x += moveX;
    ghost.y += moveY;
};
// Function to get valid moves that are not reversals of the current direction
const getValidMovesWithoutReverse = (ghost) => {
    const validMoves = _movement_utils__WEBPACK_IMPORTED_MODULE_1__.MovementUtils.getValidMoves(ghost.x, ghost.y);
    // Do not allow the ghost to reverse its direction unless it is the only way
    return validMoves.filter((move) => {
        const [dx, dy] = move;
        // Checks whether the movement would be a reversal of the current direction
        if ((ghost.direction === 'right' && dx < 0) ||
            (ghost.direction === 'left' && dx > 0) ||
            (ghost.direction === 'up' && dy > 0) ||
            (ghost.direction === 'down' && dy < 0)) {
            return false;
        }
        return true;
    });
};
// Special movement for eyes to return home
const moveEyesToHome = (ghost, store) => {
    const respawnPosition = { x: 26, y: 3 }; // Center of the ghost house
    // Check if you are already close to/inside the house
    if (Math.abs(ghost.x - respawnPosition.x) <= 1 && Math.abs(ghost.y - respawnPosition.y) <= 1) {
        // Adjust to the exact respawn position and start the respawn process
        ghost.x = respawnPosition.x;
        ghost.y = respawnPosition.y;
        ghost.inHouse = true;
        ghost.respawnCounter = 1; // Time to respawn
        return;
    }
    // Eyes move faster than normal ghosts
    const nextMove = _movement_utils__WEBPACK_IMPORTED_MODULE_1__.MovementUtils.findNextStepDijkstra({ x: ghost.x, y: ghost.y }, respawnPosition);
    if (nextMove) {
        // Calculate direction based on movement
        const dx = nextMove.x - ghost.x;
        const dy = nextMove.y - ghost.y;
        // Update direction based on actual movement
        if (dx > 0)
            ghost.direction = 'right';
        else if (dx < 0)
            ghost.direction = 'left';
        else if (dy > 0)
            ghost.direction = 'down';
        else if (dy < 0)
            ghost.direction = 'up';
        // Update position
        ghost.x = nextMove.x;
        ghost.y = nextMove.y;
    }
    else {
        // If you can't find a path, use BFSTargetedLocation as a fallback
        const alternativeMove = BFSTargetLocation(ghost.x, ghost.y, respawnPosition.x, respawnPosition.y, ghost.direction);
        if (alternativeMove) {
            ghost.x = alternativeMove.x;
            ghost.y = alternativeMove.y;
            if (alternativeMove.direction) {
                ghost.direction = alternativeMove.direction;
            }
        }
    }
};
// Specific movement for each ghost personality
const moveGhostWithPersonality = (ghost, store) => {
    // If the ghost is respawning (eyes only), use expert logic
    if (ghost.name === 'eyes') {
        moveEyesToHome(ghost, store);
        return;
    }
    // Target calculation based on ghost personality
    const target = calculateGhostTarget(ghost, store);
    ghost.target = target;
    // Finds the next move using BFS, respecting no-reversal rules
    const nextMove = BFSTargetLocation(ghost.x, ghost.y, target.x, target.y, ghost.direction);
    if (nextMove) {
        ghost.x = nextMove.x;
        ghost.y = nextMove.y;
        if (nextMove.direction) {
            ghost.direction = nextMove.direction;
        }
    }
};
// Improved version of BFS that respects the no-reversion rule
const BFSTargetLocation = (startX, startY, targetX, targetY, currentDirection) => {
    // If we are already on target, no need to move
    if (startX === targetX && startY === targetY)
        return null;
    const queue = [{ x: startX, y: startY, path: [], direction: currentDirection || 'right' }];
    const visited = new Set();
    visited.add(`${startX},${startY}`);
    while (queue.length > 0) {
        const current = queue.shift();
        const { x, y, path, direction } = current;
        // Get valid moves
        const validMoves = _movement_utils__WEBPACK_IMPORTED_MODULE_1__.MovementUtils.getValidMoves(x, y);
        // Filter out moves that would reverse the current direction
        const filteredMoves = validMoves.filter((move) => {
            const [dx, dy] = move;
            // If we have no defined direction, allow any movement
            if (!direction)
                return true;
            // Check if it would be a reversal
            if ((direction === 'right' && dx < 0) ||
                (direction === 'left' && dx > 0) ||
                (direction === 'up' && dy > 0) ||
                (direction === 'down' && dy < 0)) {
                // If there is only one valid move and it would be a reversal, allow it anyway
                return validMoves.length === 1;
            }
            return true;
        });
        for (const [dx, dy] of filteredMoves) {
            const newX = x + dx;
            const newY = y + dy;
            const key = `${newX},${newY}`;
            if (visited.has(key))
                continue;
            visited.add(key);
            // Determine the new direction
            let newDirection;
            if (dx > 0)
                newDirection = 'right';
            else if (dx < 0)
                newDirection = 'left';
            else if (dy > 0)
                newDirection = 'down';
            else if (dy < 0)
                newDirection = 'up';
            else
                newDirection = direction;
            const pathNode = {
                x: newX,
                y: newY,
                pathDirection: newDirection
            };
            const newPath = [...path, pathNode];
            if (newX === targetX && newY === targetY) {
                // Return the first position of the path with the direction
                return newPath.length > 0
                    ? {
                        x: newPath[0].x,
                        y: newPath[0].y,
                        direction: newPath[0].pathDirection
                    }
                    : null;
            }
            queue.push({ x: newX, y: newY, path: newPath, direction: newDirection });
        }
    }
    // If we don't find a path, check if there is any valid movement
    const validMoves = _movement_utils__WEBPACK_IMPORTED_MODULE_1__.MovementUtils.getValidMoves(startX, startY);
    if (validMoves.length > 0) {
        // Choose a random move if we can't find a path
        const [dx, dy] = validMoves[Math.floor(Math.random() * validMoves.length)];
        let direction = currentDirection;
        if (dx > 0)
            direction = 'right';
        else if (dx < 0)
            direction = 'left';
        else if (dy > 0)
            direction = 'down';
        else if (dy < 0)
            direction = 'up';
        return {
            x: startX + dx,
            y: startY + dy,
            direction
        };
    }
    // If there is no valid movement, do not move
    return null;
};
// Calculates the fate for each ghost based on their personality
const calculateGhostTarget = (ghost, store) => {
    const { pacman } = store;
    let pacDirection = getPacmanDirection(store);
    // Adjust Blinky's speed based on remaining points (becomes more aggressive)
    let speedMultiplier = 1;
    if (ghost.name === 'blinky') {
        // When there are few points left, Blinky becomes faster ("Elroy mode")
        const totalDots = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH * _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT;
        const dotsEaten = totalDots - dotsRemaining;
        const percentageEaten = dotsEaten / totalDots;
        if (percentageEaten > 0.7) {
            speedMultiplier = 1.2; // 20% faster
        }
        if (percentageEaten > 0.9) {
            speedMultiplier = 1.4; // 40% faster
        }
        // Apply speed multiplier if chasing Pac-Man
        if (Math.random() < 0.8 * speedMultiplier) {
            // Blinky aims directly at Pac-Man
            return { x: pacman.x, y: pacman.y };
        }
    }
    switch (ghost.name) {
        case 'blinky': // Red - Aim directly at Pac-Man
            return { x: pacman.x, y: pacman.y };
        case 'pinky': // Pink - tries to ambush Pac-Man by positioning herself in front of him
            const lookAhead = 4; // 4 cells ahead of Pac-Man
            // Special calculation for the original "bug": when Pac-Man looks up,
            // the calculation also adds 4 cells to the left
            let targetX = pacman.x;
            let targetY = pacman.y;
            if (pacman.direction === 'up') {
                // Reproducing the original bug
                targetX = pacman.x - 4;
                targetY = pacman.y - 4;
            }
            else {
                targetX = pacman.x + pacDirection[0] * lookAhead;
                targetY = pacman.y + pacDirection[1] * lookAhead;
            }
            // Ensure the target is within the grid
            targetX = Math.min(Math.max(targetX, 0), _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - 1);
            targetY = Math.min(Math.max(targetY, 0), _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - 1);
            return { x: targetX, y: targetY };
        case 'inky': // Blue - Coordinated behavior with Blinky
            const blinky = store.ghosts.find((g) => g.name === 'blinky');
            // Landmark: 2 cells ahead of Pac-Man
            let twoAhead = {
                x: pacman.x + pacDirection[0] * 2,
                y: pacman.y + pacDirection[1] * 2
            };
            // Again, reproducing the Pinky bug upwards
            if (pacman.direction === 'up') {
                twoAhead.x = pacman.x - 2;
                twoAhead.y = pacman.y - 2;
            }
            // If Blinky exists, calculate the vector from it
            if (blinky) {
                // Fold Blinky's vector to the reference point
                const vectorX = twoAhead.x - blinky.x;
                const vectorY = twoAhead.y - blinky.y;
                twoAhead = {
                    x: twoAhead.x + vectorX,
                    y: twoAhead.y + vectorY
                };
            }
            // Ensure the target is within the grid
            twoAhead.x = Math.min(Math.max(twoAhead.x, 0), _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - 1);
            twoAhead.y = Math.min(Math.max(twoAhead.y, 0), _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - 1);
            return twoAhead;
        case 'clyde': // Orange - Toggles between chasing and random
            const distanceToPacman = _movement_utils__WEBPACK_IMPORTED_MODULE_1__.MovementUtils.calculateDistance(ghost.x, ghost.y, pacman.x, pacman.y);
            // Clyde's special behavior: if he's too close, he runs away to his corner
            if (distanceToPacman < 8) {
                return SCATTER_CORNERS['clyde']; // Go to your corner when close
            }
            else {
                // When far away, chases Pac-Man directly
                return { x: pacman.x, y: pacman.y };
            }
        default:
            // Default behavior: Aim at Pac-Man
            return { x: pacman.x, y: pacman.y };
    }
};
const getPacmanDirection = (store) => {
    switch (store.pacman.direction) {
        case 'right':
            return [1, 0];
        case 'left':
            return [-1, 0];
        case 'up':
            return [0, -1];
        case 'down':
            return [0, 1];
        default:
            return [0, 0];
    }
};
// Get a random destination for spooked ghosts
const getRandomDestination = (x, y) => {
    const maxDistance = 8;
    const randomX = x + Math.floor(Math.random() * (2 * maxDistance + 1)) - maxDistance;
    const randomY = y + Math.floor(Math.random() * (2 * maxDistance + 1)) - maxDistance;
    return {
        x: Math.max(0, Math.min(randomX, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - 1)),
        y: Math.max(0, Math.min(randomY, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - 1))
    };
};
const GhostsMovement = {
    moveGhosts
};


/***/ }),

/***/ "./src/movement/movement-utils.ts":
/*!****************************************!*\
  !*** ./src/movement/movement-utils.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MovementUtils: () => (/* binding */ MovementUtils)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/core/constants.ts");

// Check for walls and grid edges
const getValidMoves = (x, y) => {
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1] // down
    ];
    return directions.filter(([dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;
        if (newX < 0 || newX >= _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH || newY < 0 || newY >= _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT) {
            return false;
        }
        if (dx === -1) {
            return !_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.vertical[x][y].active;
        }
        else if (dx === 1) {
            return !_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.vertical[x + 1][y].active;
        }
        else if (dy === -1) {
            return !_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.horizontal[x][y].active;
        }
        else if (dy === 1) {
            return !_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.horizontal[x][y + 1].active;
        }
        return true;
    });
};
const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
const MovementUtils = {
    getValidMoves,
    calculateDistance,
    /**
     * Dijkstra's 4-way grid.
     * Returns the NEXT step (not the entire route) or null if none.
     */
    findNextStepDijkstra(start, target) {
        var _a;
        if (start.x === target.x && start.y === target.y)
            return null;
        const pq = [Object.assign(Object.assign({}, start), { cost: 0, path: [] })];
        const visited = new Set([`${start.x},${start.y}`]);
        while (pq.length) {
            // min-heap “manual”
            pq.sort((a, b) => a.cost - b.cost);
            const { x, y, cost, path } = pq.shift();
            for (const [dx, dy] of getValidMoves(x, y)) {
                const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
                if (visited.has(key))
                    continue;
                visited.add(key);
                const nextCost = cost + 1; // unit cost
                const newPath = [...path, { x: nx, y: ny }];
                if (nx === target.x && ny === target.y) {
                    return (_a = newPath[0]) !== null && _a !== void 0 ? _a : null;
                }
                pq.push({ x: nx, y: ny, cost: nextCost, path: newPath });
            }
        }
        return null;
    }
};


/***/ }),

/***/ "./src/movement/pacman-movement.ts":
/*!*****************************************!*\
  !*** ./src/movement/pacman-movement.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PacmanMovement: () => (/* binding */ PacmanMovement)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/core/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./src/types.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _movement_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./movement-utils */ "./src/movement/movement-utils.ts");




const RECENT_POSITIONS_LIMIT = 5;
const movePacman = (store) => {
    if (store.pacman.deadRemainingDuration)
        return;
    const hasPowerup = !!store.pacman.powerupRemainingDuration;
    const scaredGhosts = store.ghosts.filter((ghost) => ghost.scared);
    let targetPosition;
    // Find a target position, ensuring it's never undefined
    try {
        if (hasPowerup && scaredGhosts.length > 0) {
            const ghostPosition = findClosestScaredGhost(store);
            targetPosition = ghostPosition !== null && ghostPosition !== void 0 ? ghostPosition : findOptimalTarget(store);
        }
        else if (store.pacman.target) {
            if (store.pacman.x === store.pacman.target.x && store.pacman.y === store.pacman.target.y) {
                targetPosition = findOptimalTarget(store);
                store.pacman.target = targetPosition;
            }
            else {
                targetPosition = store.pacman.target;
            }
        }
        else {
            targetPosition = findOptimalTarget(store);
            store.pacman.target = targetPosition;
        }
        // Safety check to ensure targetPosition is never undefined
        if (!targetPosition) {
            targetPosition = { x: store.pacman.x, y: store.pacman.y };
        }
        const nextPosition = calculateOptimalPath(store, targetPosition);
        nextPosition ? updatePacmanPosition(store, nextPosition) : makeDesperationMove(store);
        checkAndEatPoint(store);
    }
    catch (error) {
        console.error('Error in movePacman:', error);
        // If all else fails, don't move
    }
};
const findClosestScaredGhost = (store) => {
    const scaredGhosts = store.ghosts.filter((g) => g.scared);
    if (scaredGhosts.length === 0)
        return null;
    return scaredGhosts.reduce((closest, ghost) => {
        const distance = _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.calculateDistance(ghost.x, ghost.y, store.pacman.x, store.pacman.y);
        return distance < closest.distance ? { x: ghost.x, y: ghost.y, distance } : closest;
    }, { x: store.pacman.x, y: store.pacman.y, distance: Infinity });
};
const findOptimalTarget = (store) => {
    const pointCells = [];
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT; y++) {
            const cell = store.grid[x][y];
            if (cell.level !== 'NONE') {
                const distance = _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.calculateDistance(x, y, store.pacman.x, store.pacman.y);
                const value = cell.commitsCount / (distance + 1);
                pointCells.push({ x, y, value });
            }
        }
    }
    pointCells.sort((a, b) => b.value - a.value);
    // Check if there are any cells with points left
    if (pointCells.length === 0) {
        // Return Pac-Man's current position as fallback
        return { x: store.pacman.x, y: store.pacman.y, value: 0 };
    }
    return pointCells[0];
};
const calculateOptimalPath = (store, target) => {
    var _a;
    const queue = [
        { x: store.pacman.x, y: store.pacman.y, path: [], score: 0 }
    ];
    const visited = new Set([`${store.pacman.x},${store.pacman.y}`]);
    const dangerMap = createDangerMap(store);
    const maxDangerValue = 15;
    // Set weights according to player style - more extreme values
    let safetyWeight = 0.5; // standard weight for safety
    let pointWeight = 0.5; // standard weight for points
    switch (store.config.playerStyle) {
        case _types__WEBPACK_IMPORTED_MODULE_1__.PlayerStyle.CONSERVATIVE:
            safetyWeight = 3.0; // Much higher values ​​to ensure conservative behavior
            pointWeight = 0.1;
            break;
        case _types__WEBPACK_IMPORTED_MODULE_1__.PlayerStyle.AGGRESSIVE:
            safetyWeight = 0.3;
            pointWeight = 2.0;
            break;
        case _types__WEBPACK_IMPORTED_MODULE_1__.PlayerStyle.OPPORTUNISTIC:
        default:
            safetyWeight = 0.8;
            pointWeight = 0.8;
            break;
    }
    // Calculate the distance to the nearest ghost
    let closestGhostDistance = Infinity;
    store.ghosts.forEach((ghost) => {
        if (!ghost.scared) {
            const dist = _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.calculateDistance(store.pacman.x, store.pacman.y, ghost.x, ghost.y);
            closestGhostDistance = Math.min(closestGhostDistance, dist);
        }
    });
    // Narrower danger threshold for conservative
    const dangerThreshold = store.config.playerStyle === _types__WEBPACK_IMPORTED_MODULE_1__.PlayerStyle.CONSERVATIVE ? 5 : 7;
    const dangerNearby = closestGhostDistance < dangerThreshold;
    // Adjust weights further if there is danger and it is conservative
    if (store.config.playerStyle === _types__WEBPACK_IMPORTED_MODULE_1__.PlayerStyle.CONSERVATIVE && dangerNearby) {
        safetyWeight *= 5; // Dramatically increase the safety weight in dangerous situations
    }
    while (queue.length > 0) {
        queue.sort((a, b) => b.score - a.score);
        const current = queue.shift();
        const { x, y, path } = current;
        if (x === target.x && y === target.y) {
            // Upon arrival at the destination, analyze the behavior
            if (path.length > 0) {
                let totalSafetyScore = 0;
                let totalPointScore = 0;
                path.forEach((point) => {
                    const key = `${point.x},${point.y}`;
                    const danger = dangerMap.get(key) || 0;
                    const points = store.grid[point.x][point.y].commitsCount;
                    totalSafetyScore -= danger * safetyWeight;
                    totalPointScore += points * pointWeight;
                });
                return path[0];
            }
            return null;
        }
        for (const [dx, dy] of _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.getValidMoves(x, y)) {
            const newX = x + dx;
            const newY = y + dy;
            const key = `${newX},${newY}`;
            if (!visited.has(key)) {
                const newPath = [...path, { x: newX, y: newY }];
                const danger = dangerMap.get(key) || 0;
                const pointValue = store.grid[newX][newY].commitsCount;
                const distanceToTarget = _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.calculateDistance(newX, newY, target.x, target.y);
                const revisitPenalty = ((_a = store.pacman.recentPositions) === null || _a === void 0 ? void 0 : _a.includes(key)) ? 100 : 0;
                let safetyScore, pointScore, finalScore;
                // Completely inverted punctuation logic for conservative style
                if (store.config.playerStyle === _types__WEBPACK_IMPORTED_MODULE_1__.PlayerStyle.CONSERVATIVE) {
                    // For conservative: danger is MUCH more important than points
                    safetyScore = (maxDangerValue - danger) * safetyWeight;
                    // Severe penalties for dangerous cells
                    if (danger >= 5) {
                        safetyScore -= 100; // Severe penalty for dangerous cells
                    }
                    else {
                        // Bonus for safe cells
                        safetyScore += 50;
                    }
                    pointScore = pointValue * pointWeight;
                    const distanceScore = -distanceToTarget / 10;
                    // Score components are different for conservative
                    finalScore = safetyScore * 5 + pointScore + distanceScore - revisitPenalty;
                }
                else {
                    // Default logic for other styles
                    safetyScore = (maxDangerValue - danger) * safetyWeight;
                    pointScore = pointValue * pointWeight;
                    const distanceScore = -distanceToTarget / 10;
                    finalScore = safetyScore + pointScore + distanceScore - revisitPenalty;
                }
                queue.push({
                    x: newX,
                    y: newY,
                    path: newPath,
                    score: finalScore
                });
                visited.add(key);
            }
        }
    }
    return null;
};
const createDangerMap = (store) => {
    const map = new Map();
    const hasPowerup = !!store.pacman.powerupRemainingDuration;
    store.ghosts.forEach((ghost) => {
        if (ghost.scared)
            return;
        for (let dx = -5; dx <= 5; dx++) {
            for (let dy = -5; dy <= 5; dy++) {
                const x = ghost.x + dx;
                const y = ghost.y + dy;
                if (x >= 0 && x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH && y >= 0 && y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT) {
                    const key = `${x},${y}`;
                    const distance = Math.abs(dx) + Math.abs(dy);
                    const value = 15 - distance;
                    if (value > 0) {
                        const current = map.get(key) || 0;
                        map.set(key, Math.max(current, value));
                    }
                }
            }
        }
    });
    if (hasPowerup) {
        for (const [key, value] of map.entries()) {
            map.set(key, value / 5);
        }
    }
    return map;
};
const makeDesperationMove = (store) => {
    const validMoves = _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.getValidMoves(store.pacman.x, store.pacman.y);
    if (validMoves.length === 0)
        return;
    const safest = validMoves.reduce((best, [dx, dy]) => {
        const newX = store.pacman.x + dx;
        const newY = store.pacman.y + dy;
        let minDist = Infinity;
        store.ghosts.forEach((ghost) => {
            if (!ghost.scared) {
                const dist = _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.calculateDistance(ghost.x, ghost.y, newX, newY);
                minDist = Math.min(minDist, dist);
            }
        });
        return minDist > best.distance ? { dx, dy, distance: minDist } : best;
    }, { dx: 0, dy: 0, distance: -Infinity });
    updatePacmanPosition(store, {
        x: store.pacman.x + safest.dx,
        y: store.pacman.y + safest.dy
    });
};
const updatePacmanPosition = (store, position) => {
    var _a;
    (_a = store.pacman).recentPositions || (_a.recentPositions = []);
    store.pacman.recentPositions.push(`${position.x},${position.y}`);
    if (store.pacman.recentPositions.length > RECENT_POSITIONS_LIMIT) {
        store.pacman.recentPositions.shift();
    }
    const dx = position.x - store.pacman.x;
    const dy = position.y - store.pacman.y;
    store.pacman.direction = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : dy < 0 ? 'up' : store.pacman.direction;
    store.pacman.x = position.x;
    store.pacman.y = position.y;
};
const checkAndEatPoint = (store) => {
    const cell = store.grid[store.pacman.x][store.pacman.y];
    if (cell.level !== 'NONE') {
        store.pacman.totalPoints += cell.commitsCount;
        store.pacman.points++;
        store.config.pointsIncreasedCallback(store.pacman.totalPoints);
        const theme = _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.getCurrentTheme(store);
        // Power-up activated in the cell
        if (cell.level === 'FOURTH_QUARTILE') {
            activatePowerUp(store);
        }
        // "Delete" point from cell
        cell.level = 'NONE';
        cell.color = theme.intensityColors[0];
        cell.commitsCount = 0;
    }
};
const activatePowerUp = (store) => {
    store.pacman.powerupRemainingDuration = _core_constants__WEBPACK_IMPORTED_MODULE_0__.PACMAN_POWERUP_DURATION;
    store.ghosts.forEach((g) => (g.scared = true));
};
const PacmanMovement = {
    movePacman
};


/***/ }),

/***/ "./src/music-player.ts":
/*!*****************************!*\
  !*** ./src/music-player.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MusicPlayer: () => (/* binding */ MusicPlayer),
/* harmony export */   Sound: () => (/* binding */ Sound)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Sound;
(function (Sound) {
    Sound["DEFAULT"] = "https://cdn.jsdelivr.net/npm/pacman-contribution-graph/src/assets/sounds/pacman_chomp.wav";
    Sound["BEGINNING"] = "https://cdn.jsdelivr.net/npm/pacman-contribution-graph/src/assets/sounds/pacman_beginning.wav";
    Sound["GAME_OVER"] = "https://cdn.jsdelivr.net/npm/pacman-contribution-graph/src/assets/sounds/pacman_death.wav";
    Sound["EAT_GHOST"] = "https://cdn.jsdelivr.net/npm/pacman-contribution-graph/src/assets/sounds/pacman_eatghost.wav";
})(Sound || (Sound = {}));
class MusicPlayer {
    constructor() {
        this.sounds = new Map();
        this.currentSource = null;
        this.defaultSource = null;
        this.isMuted = false;
        this.audioContext = new AudioContext();
    }
    static getInstance() {
        if (!MusicPlayer.instance) {
            MusicPlayer.instance = new MusicPlayer();
        }
        return MusicPlayer.instance;
    }
    preloadSounds() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const sound of Object.values(Sound)) {
                const response = yield fetch(sound);
                const arrayBuffer = yield response.arrayBuffer();
                const audioBuffer = yield this.audioContext.decodeAudioData(arrayBuffer);
                this.sounds.set(sound, audioBuffer);
            }
        });
    }
    play(sound) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isMuted) {
                return;
            }
            if (this.currentSource) {
                try {
                    this.currentSource.stop();
                }
                catch (ex) { }
            }
            const buffer = this.sounds.get(sound);
            if (!buffer) {
                console.error(`Sound ${sound} not found`);
                return;
            }
            this.currentSource = this.audioContext.createBufferSource();
            this.currentSource.buffer = buffer;
            this.currentSource.connect(this.audioContext.destination);
            if (!this.isMuted) {
                this.currentSource.start();
            }
            return new Promise((resolve) => {
                this.currentSource.onended = () => {
                    this.currentSource = null;
                    resolve();
                };
            });
        });
    }
    startDefaultSound() {
        if (this.defaultSource) {
            try {
                this.defaultSource.stop();
            }
            catch (ex) { }
        }
        const buffer = this.sounds.get(Sound.DEFAULT);
        if (!buffer) {
            console.error('Default sound not found');
            return;
        }
        this.defaultSource = this.audioContext.createBufferSource();
        this.defaultSource.buffer = buffer;
        this.defaultSource.loop = true;
        this.defaultSource.connect(this.audioContext.destination);
        if (!this.isMuted) {
            this.defaultSource.start();
        }
    }
    stopDefaultSound() {
        if (this.defaultSource) {
            try {
                this.defaultSource.stop();
            }
            catch (ex) { }
            this.defaultSource = null;
        }
    }
    mute() {
        this.isMuted = true;
        if (this.currentSource) {
            this.currentSource.disconnect();
        }
        if (this.defaultSource) {
            this.defaultSource.disconnect();
        }
    }
    unmute() {
        this.isMuted = false;
        if (this.currentSource) {
            this.currentSource.connect(this.audioContext.destination);
        }
        if (this.defaultSource) {
            this.defaultSource.connect(this.audioContext.destination);
        }
    }
}


/***/ }),

/***/ "./src/providers/github-contributions.ts":
/*!***********************************************!*\
  !*** ./src/providers/github-contributions.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchGithubContributions: () => (/* binding */ fetchGithubContributions)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const fetchGithubContributions = (store) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = store.config.githubSettings) === null || _a === void 0 ? void 0 : _a.accessToken) {
        return yield fetchGithubContributionsGraphQL(store);
    }
    else {
        return yield fetchGithubContributionsRest(store);
    }
});
const fetchGithubContributionsRest = (store) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const commits = [];
    let isComplete = false;
    let page = 1;
    do {
        try {
            const headers = {};
            if ((_b = store.config.githubSettings) === null || _b === void 0 ? void 0 : _b.accessToken) {
                headers['Authorization'] = 'Bearer ' + store.config.githubSettings.accessToken;
            }
            const response = yield fetch(`https://api.github.com/search/commits?q=author:${store.config.username}&sort=author-date&order=desc&page=${page}&per_page=100`, { headers });
            const data = yield response.json();
            isComplete = !data.items || data.items.length === 0;
            commits.push(...((_c = data.items) !== null && _c !== void 0 ? _c : []));
            page++;
        }
        catch (_d) {
            isComplete = true;
        }
    } while (!isComplete);
    const contributions = Array.from(commits
        .reduce((map, item) => {
        var _a, _b, _c, _d;
        const authorDateStr = (_b = (_a = item.commit.author) === null || _a === void 0 ? void 0 : _a.date) === null || _b === void 0 ? void 0 : _b.split('T')[0];
        const committerDateStr = (_d = (_c = item.commit.committer) === null || _c === void 0 ? void 0 : _c.date) === null || _d === void 0 ? void 0 : _d.split('T')[0];
        const keyDate = committerDateStr || authorDateStr;
        const count = (map.get(keyDate) || { count: 0 }).count + 1;
        return map.set(keyDate, {
            date: new Date(keyDate),
            count,
            color: '',
            level: 'NONE'
        });
    }, new Map())
        .values());
    // Find the max non-zero contribution count
    const maxCount = Math.max(...contributions.map((el) => el.count).filter((c) => c > 0));
    return contributions.map((c) => {
        const level = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.calculateContributionLevel)(c.count, maxCount);
        const theme = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.getCurrentTheme)(store);
        return {
            date: new Date(c.date),
            count: c.count,
            color: theme.intensityColors[(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.levelToIndex)(level)],
            level
        };
    });
});
const fetchGithubContributionsGraphQL = (store) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const query = /* GraphQL */ `
		query ($login: String!) {
			user(login: $login) {
				contributionsCollection {
					contributionCalendar {
						weeks {
							contributionDays {
								date
								contributionCount
								color
								contributionLevel
							}
						}
					}
				}
			}
		}
	`;
    const response = yield fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${(_e = store.config.githubSettings) === null || _e === void 0 ? void 0 : _e.accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables: { login: store.config.username } })
    });
    if (!response.ok) {
        throw new Error(`GitHub GraphQL request failed: ${response.status} ${response.statusText}`);
    }
    const json = (yield response.json());
    return json.data.user.contributionsCollection.contributionCalendar.weeks
        .map((week) => week.contributionDays)
        .reduce((acc, days) => acc.concat(days), [])
        .map((d) => {
        const level = d.contributionLevel;
        const theme = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.getCurrentTheme)(store);
        return {
            date: new Date(d.date),
            count: d.contributionCount,
            color: theme.intensityColors[(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.levelToIndex)(level)],
            level
        };
    });
});


/***/ }),

/***/ "./src/providers/gitlab-contributions.ts":
/*!***********************************************!*\
  !*** ./src/providers/gitlab-contributions.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchGitlabContributions: () => (/* binding */ fetchGitlabContributions)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const fetchGitlabContributions = (store) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://v0-new-project-q1hhrdodoye-abozanona-gmailcoms-projects.vercel.app/api/contributions?username=${store.config.username}`);
    const contributionsList = yield response.json();
    const contributions = Object.entries(contributionsList).map(([date, count]) => ({
        date: new Date(date),
        count: Number(count),
        color: '',
        level: 'NONE'
    }));
    // Find the max non-zero contribution count
    const maxCount = Math.max(...contributions.map((el) => el.count).filter((c) => c > 0));
    return contributions.map((c) => {
        const level = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.calculateContributionLevel)(c.count, maxCount);
        const theme = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.getCurrentTheme)(store);
        return {
            date: new Date(c.date),
            count: c.count,
            color: theme.intensityColors[(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.levelToIndex)(level)],
            level
        };
    });
});


/***/ }),

/***/ "./src/providers/providers.ts":
/*!************************************!*\
  !*** ./src/providers/providers.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Providers: () => (/* binding */ Providers)
/* harmony export */ });
/* harmony import */ var _github_contributions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./github-contributions */ "./src/providers/github-contributions.ts");
/* harmony import */ var _gitlab_contributions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gitlab-contributions */ "./src/providers/gitlab-contributions.ts");


const Providers = {
    fetchGithubContributions: _github_contributions__WEBPACK_IMPORTED_MODULE_0__.fetchGithubContributions,
    fetchGitlabContributions: _gitlab_contributions__WEBPACK_IMPORTED_MODULE_1__.fetchGitlabContributions
};


/***/ }),

/***/ "./src/renderers/canvas.ts":
/*!*********************************!*\
  !*** ./src/renderers/canvas.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Canvas: () => (/* binding */ Canvas)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/core/constants.ts");
/* harmony import */ var _music_player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../music-player */ "./src/music-player.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _renderer_units__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./renderer-units */ "./src/renderers/renderer-units.ts");




const resizeCanvas = (store) => {
    const canvasWidth = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
    const canvasHeight = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + 20; // Adding some space for months on top
    store.config.canvas.width = canvasWidth;
    store.config.canvas.height = canvasHeight;
};
const drawGrid = (store) => {
    const ctx = store.config.canvas.getContext('2d');
    ctx.fillStyle = _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.getCurrentTheme(store).gridBackground;
    ctx.fillRect(0, 0, store.config.canvas.width, store.config.canvas.height);
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT; y++) {
            if (store.grid[x][y].level !== 'NONE') {
                const color = store.grid[x][y].color;
                ctx.fillStyle = color;
            }
            else {
                ctx.fillStyle = _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.getCurrentTheme(store).intensityColors[0];
            }
            ctx.beginPath();
            store.config.canvas
                .getContext('2d')
                .roundRect(x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE), y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + 15, _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE, _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE, 5);
            ctx.fill();
        }
    }
    ctx.fillStyle = _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.getCurrentTheme(store).wallColor;
    for (let x = 0; x <= _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
        for (let y = 0; y <= _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT; y++) {
            // Draw horizontal walls
            if (_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.horizontal[x][y].active) {
                ctx.fillRect(x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE, y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE + 15, _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
                // TODO: For drawing lines labels only
                // ctx.fillStyle = '#000';
                // ctx.fillText(WALLS.horizontal[x][y].id, x * (GAP_SIZE + CELL_SIZE), y * (GAP_SIZE + CELL_SIZE));
            }
            // Draw vertical walls
            if (_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.vertical[x][y].active) {
                ctx.fillRect(x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE, y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE + 15, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE, _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
                // TODO: For drawing lines labels only
                // ctx.fillStyle = '#000';
                // ctx.fillText(WALLS.vertical[x][y].id, x * (GAP_SIZE + CELL_SIZE), (y + 1) * (GAP_SIZE + CELL_SIZE));
            }
        }
    }
    ctx.fillStyle = _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.getCurrentTheme(store).textColor;
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    let lastMonth = '';
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
        if (store.monthLabels[x] !== lastMonth) {
            const xPos = x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2;
            ctx.fillText(store.monthLabels[x], xPos, 10);
            lastMonth = store.monthLabels[x];
        }
    }
};
const drawPacman = (store) => {
    const ctx = store.config.canvas.getContext('2d');
    const x = store.pacman.x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2;
    const y = store.pacman.y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2 + 15;
    const radius = _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2;
    // Change Pac-Man's color to red if he's on power-up, dead, else yellow
    ctx.fillStyle = _renderer_units__WEBPACK_IMPORTED_MODULE_3__.RendererUnits.generatePacManColors(store.pacman);
    const mouthAngle = store.pacmanMouthOpen ? 0.35 * Math.PI : 0.1 * Math.PI;
    let startAngle, endAngle;
    switch (store.pacman.direction) {
        case 'up':
            startAngle = 1.5 * Math.PI + mouthAngle;
            endAngle = 1.5 * Math.PI - mouthAngle;
            break;
        case 'down':
            startAngle = 0.5 * Math.PI + mouthAngle;
            endAngle = 0.5 * Math.PI - mouthAngle;
            break;
        case 'left':
            startAngle = Math.PI + mouthAngle;
            endAngle = Math.PI - mouthAngle;
            break;
        case 'right':
        default:
            startAngle = 0 + mouthAngle;
            endAngle = 2 * Math.PI - mouthAngle;
            break;
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.lineTo(x, y);
    ctx.fill();
};
const preloadedImages = {};
const getLoadedImage = (key, imgDate) => {
    if (!preloadedImages[key]) {
        const image = new Image();
        image.src = imgDate;
        preloadedImages[key] = image;
    }
    return preloadedImages[key];
};
const drawGhosts = (store) => {
    store.ghosts.forEach((ghost) => {
        const x = ghost.x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
        const y = ghost.y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + 15;
        const size = _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE;
        const ctx = store.config.canvas.getContext('2d');
        if (ghost.scared) {
            if ("imgDate" in _core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS.scared) {
                ctx.drawImage(getLoadedImage('scared', _core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS.scared.imgDate), x, y, size, size);
            }
        }
        else {
            const ghostData = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS[ghost.name];
            const direction = ghost.direction;
            const imgSrc = ghostData[direction];
            ctx.drawImage(getLoadedImage(ghost.name + '-' + ghost.direction, imgSrc), x, y, size, size);
        }
    });
};
const renderGameOver = (store) => {
    const ctx = store.config.canvas.getContext('2d');
    ctx.fillStyle = _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.getCurrentTheme(store).textColor;
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', store.config.canvas.width / 2, store.config.canvas.height / 2);
};
const drawSoundController = (store) => {
    if (!store.config.enableSounds) {
        return;
    }
    const ctx = store.config.canvas.getContext('2d');
    const width = 30, height = 30, left = store.config.canvas.width - width - 10, top = 10;
    ctx.fillStyle = `rgba(0, 0, 0, ${_music_player__WEBPACK_IMPORTED_MODULE_1__.MusicPlayer.getInstance().isMuted ? 0.3 : 0.5})`;
    ctx.beginPath();
    ctx.moveTo(left + 10, top + 10);
    ctx.lineTo(left + 20, top + 5);
    ctx.lineTo(left + 20, top + 25);
    ctx.lineTo(left + 10, top + 20);
    ctx.closePath();
    ctx.fill();
    if (!_music_player__WEBPACK_IMPORTED_MODULE_1__.MusicPlayer.getInstance().isMuted) {
        ctx.strokeStyle = `rgba(0, 0, 0, 0.4)`;
        ctx.lineWidth = 2;
        // First wave
        ctx.beginPath();
        ctx.arc(left + 25, top + 15, 5, 0, Math.PI * 2);
        ctx.stroke();
        // Second wave
        ctx.beginPath();
        ctx.arc(left + 25, top + 15, 8, 0, Math.PI * 2);
        ctx.stroke();
    }
    else {
        // Mute line
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(left + 25, top + 5);
        ctx.lineTo(left + 5, top + 25);
        ctx.stroke();
    }
};
const listenToSoundController = (store) => {
    if (!store.config.enableSounds) {
        return;
    }
    store.config.canvas.addEventListener('click', function (event) {
        const rect = store.config.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left, y = event.clientY - rect.top;
        const width = 30, height = 30, left = store.config.canvas.width - width - 10, top = 10;
        if (x >= left && x <= left + this.width && y >= top && y <= top + this.height) {
            if (_music_player__WEBPACK_IMPORTED_MODULE_1__.MusicPlayer.getInstance().isMuted) {
                _music_player__WEBPACK_IMPORTED_MODULE_1__.MusicPlayer.getInstance().unmute();
            }
            else {
                _music_player__WEBPACK_IMPORTED_MODULE_1__.MusicPlayer.getInstance().mute();
            }
        }
    });
};
const Canvas = {
    resizeCanvas,
    drawGrid,
    drawPacman,
    drawGhosts,
    renderGameOver,
    drawSoundController,
    listenToSoundController
};


/***/ }),

/***/ "./src/renderers/renderer-units.ts":
/*!*****************************************!*\
  !*** ./src/renderers/renderer-units.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RendererUnits: () => (/* binding */ RendererUnits)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/core/constants.ts");

const generatePacManColors = (pacman) => {
    if (pacman.deadRemainingDuration) {
        return _core_constants__WEBPACK_IMPORTED_MODULE_0__.PACMAN_COLOR_DEAD;
    }
    else if (pacman.powerupRemainingDuration) {
        return _core_constants__WEBPACK_IMPORTED_MODULE_0__.PACMAN_COLOR_POWERUP;
    }
    else {
        return _core_constants__WEBPACK_IMPORTED_MODULE_0__.PACMAN_COLOR;
    }
};
const RendererUnits = {
    generatePacManColors
};


/***/ }),

/***/ "./src/renderers/svg.ts":
/*!******************************!*\
  !*** ./src/renderers/svg.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SVG: () => (/* binding */ SVG)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/core/constants.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _renderer_units__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderer-units */ "./src/renderers/renderer-units.ts");



const SVG_KEY_TIMES_PRECISION = 4;
const generateAnimatedSVG = (store) => {
    // Dimensions and duration
    const svgWidth = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
    const svgHeight = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + 30; // Extra height for time counter
    const totalDurationMs = store.gameHistory.length * _core_constants__WEBPACK_IMPORTED_MODULE_0__.DELTA_TIME;
    // Basic SVG structure
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<desc>Generated with pacman-contribution-graph on ${new Date()}</desc>`;
    svg += `<metadata>
		<info>
			<frames>${store.gameHistory.length}</frames>
			<frameRate>${1000 / _core_constants__WEBPACK_IMPORTED_MODULE_0__.DELTA_TIME}</frameRate>
			<durationMs>${totalDurationMs}</durationMs>
			<generatedOn>${new Date().toISOString()}</generatedOn>
		</info>
	</metadata>`;
    svg += `<rect width="100%" height="100%" fill="${_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.getCurrentTheme(store).gridBackground}"/>`;
    svg += generateGhostsPredefinition();
    // Month labels
    let lastMonth = '';
    for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; y++) {
        if (store.monthLabels[y] !== lastMonth) {
            const xPos = y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2;
            svg += `<text x="${xPos}" y="10" text-anchor="middle" font-size="10" fill="${_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.getCurrentTheme(store).textColor}">${store.monthLabels[y]}</text>`;
            lastMonth = store.monthLabels[y];
        }
    }
    // Grid
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT; y++) {
            const cellX = x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
            const cellY = y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + 15;
            const cellColorAnimation = generateChangingValuesAnimation(store, generateCellColorValues(store, x, y));
            svg += `<rect id="c-${x}-${y}" x="${cellX}" y="${cellY}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" rx="5" fill="${_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.getCurrentTheme(store).intensityColors[0]}">
				<animate attributeName="fill" dur="${totalDurationMs}ms" repeatCount="indefinite" 
					values="${cellColorAnimation.values}" 
					keyTimes="${cellColorAnimation.keyTimes}"/>
			</rect>`;
        }
    }
    // Walls
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT; y++) {
            if (_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.horizontal[x][y].active) {
                svg += `<rect id="wh-${x}-${y}" x="${x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE}" y="${y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE + 15}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE}" rx="5" fill="${_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.getCurrentTheme(store).wallColor}"></rect>`;
            }
            if (_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.vertical[x][y].active) {
                svg += `<rect id="wv-${x}-${y}" x="${x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE}" y="${y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE + 15}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE}" rx="5" fill="${_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.getCurrentTheme(store).wallColor}"></rect>`;
            }
        }
    }
    // Pacman
    const pacmanColorAnimation = generateChangingValuesAnimation(store, store.gameHistory.map((el) => _renderer_units__WEBPACK_IMPORTED_MODULE_2__.RendererUnits.generatePacManColors(el.pacman)));
    const pacmanPositionAnimation = generateChangingValuesAnimation(store, generatePacManPositions(store));
    const pacmanRotationAnimation = generateChangingValuesAnimation(store, generatePacManRotations(store));
    svg += `<path id="pacman" d="${generatePacManPath(0.55)}" fill="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.PACMAN_COLOR}">
		<animate attributeName="fill" dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanColorAnimation.keyTimes}"
			values="${pacmanColorAnimation.values}"/>
		<animateTransform attributeName="transform" type="translate" dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanPositionAnimation.keyTimes}"
			values="${pacmanPositionAnimation.values}"
			additive="sum"/>
		<animateTransform attributeName="transform" type="rotate" dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanRotationAnimation.keyTimes}"
			values="${pacmanRotationAnimation.values}"
			additive="sum"/>
		<animate attributeName="d" dur="0.5s" repeatCount="indefinite"
			values="${generatePacManPath(0.55)};${generatePacManPath(0.05)};${generatePacManPath(0.55)}"/>
	</path>`;
    // Process each ghost separately
    store.ghosts.forEach((ghost, index) => {
        // Generate position animation for this ghost
        const ghostPositionAnimation = generateChangingValuesAnimation(store, generateGhostPositions(store, index));
        // Create a group for the ghost
        svg += `<g id="ghost${index}" transform="translate(0,0)">
			<animateTransform attributeName="transform" type="translate" 
				dur="${totalDurationMs}ms" repeatCount="indefinite"
				keyTimes="${ghostPositionAnimation.keyTimes}"
				values="${ghostPositionAnimation.values}"
				additive="replace"/>`;
        // Map all possible state + direction combinations for this ghost
        const stateChanges = mapGhostStateChanges(store, index);
        // For each possible state, create a <use> element with visibility animation
        for (const [state, keyframes] of Object.entries(stateChanges)) {
            // Ignore empty states
            if (keyframes.length === 0)
                continue;
            // Use the correct ID for reference (blinky-right, scared, etc)
            const href = `#ghost-${state}`;
            // Build the strings for the animation
            const keyTimes = keyframes.map((kf) => kf.time.toFixed(SVG_KEY_TIMES_PRECISION)).join(';');
            const values = keyframes.map((kf) => (kf.visible ? 'visible' : 'hidden')).join(';');
            // Initial visibility
            const initialVisibility = keyframes[0].visible ? 'visible' : 'hidden';
            svg += `<use href="${href}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" visibility="${initialVisibility}">
				<animate attributeName="visibility" 
					dur="${totalDurationMs}ms" repeatCount="indefinite"
					keyTimes="${keyTimes}"
					values="${values}" />
			</use>`;
        }
        // Close the ghost group
        svg += `</g>`;
    });
    svg += '</svg>';
    return svg;
};
// Helper function to map all ghost state changes
function mapGhostStateChanges(store, ghostIndex) {
    // A map of states for frames where they are visible
    // Key: "name-direction" or "scared" or "eyes-direction"
    // Value: array of {time: number, visible: boolean}
    const stateChanges = {};
    // Initialize possible states for all ghosts
    const allPossibleStates = [
        'blinky-up',
        'blinky-down',
        'blinky-left',
        'blinky-right',
        'inky-up',
        'inky-down',
        'inky-left',
        'inky-right',
        'pinky-up',
        'pinky-down',
        'pinky-left',
        'pinky-right',
        'clyde-up',
        'clyde-down',
        'clyde-left',
        'clyde-right',
        'eyes-up',
        'eyes-down',
        'eyes-left',
        'eyes-right',
        'scared'
    ];
    // Initialize all states as hidden
    allPossibleStates.forEach((state) => {
        stateChanges[state] = [{ time: 0, visible: false }];
    });
    // Get the initial ghost
    const initialGhost = store.ghosts[ghostIndex];
    if (!initialGhost)
        return stateChanges;
    // Set the initial state correctly
    const initialState = initialGhost.scared
        ? 'scared'
        : initialGhost.name === 'eyes'
            ? `eyes-${initialGhost.direction || 'right'}`
            : `${initialGhost.name}-${initialGhost.direction || 'right'}`;
    // Mark this state as visible initially
    stateChanges[initialState] = [{ time: 0, visible: true }];
    // Track last state
    let lastState = initialState;
    // Process each frame of the game history
    store.gameHistory.forEach((state, frameIndex) => {
        // If the ghost does not exist in this frame, skip
        if (ghostIndex >= state.ghosts.length)
            return;
        const ghost = state.ghosts[ghostIndex];
        const currentTime = frameIndex / (store.gameHistory.length - 1);
        // Determine the current state
        const currentState = ghost.scared
            ? 'scared'
            : ghost.name === 'eyes'
                ? `eyes-${ghost.direction || 'right'}`
                : `${ghost.name}-${ghost.direction || 'right'}`;
        // If the status has changed
        if (currentState !== lastState) {
            // Hide previous state
            stateChanges[lastState].push({ time: currentTime, visible: false });
            // Show new status
            if (!stateChanges[currentState]) {
                stateChanges[currentState] = [{ time: 0, visible: false }];
            }
            stateChanges[currentState].push({ time: currentTime, visible: true });
            // Update the latest status
            lastState = currentState;
        }
    });
    // Ensure the last state remains visible until the end
    stateChanges[lastState].push({ time: 1, visible: true });
    // Ensure all other states are hidden until the end
    Object.keys(stateChanges).forEach((state) => {
        if (state !== lastState && stateChanges[state].length > 0) {
            const lastKeyframe = stateChanges[state][stateChanges[state].length - 1];
            if (lastKeyframe.time < 1) {
                stateChanges[state].push({ time: 1, visible: false });
            }
        }
    });
    return stateChanges;
}
const generatePacManPath = (mouthAngle) => {
    const radius = _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2;
    const startAngle = mouthAngle;
    const endAngle = 2 * Math.PI - mouthAngle;
    return `M ${radius},${radius}
            L ${radius + radius * Math.cos(startAngle)},${radius + radius * Math.sin(startAngle)}
            A ${radius},${radius} 0 1,1 ${radius + radius * Math.cos(endAngle)},${radius + radius * Math.sin(endAngle)}
            Z`;
};
const generatePacManPositions = (store) => {
    return store.gameHistory.map((state) => {
        const x = state.pacman.x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
        const y = state.pacman.y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + 15;
        return `${x},${y}`;
    });
};
const generatePacManRotations = (store) => {
    const pivit = _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2;
    return store.gameHistory.map((state) => {
        switch (state.pacman.direction) {
            case 'right':
                return `0 ${pivit} ${pivit}`;
            case 'left':
                return `180 ${pivit} ${pivit}`;
            case 'up':
                return `270 ${pivit} ${pivit}`;
            case 'down':
                return `90 ${pivit} ${pivit}`;
            default:
                return `0 ${pivit} ${pivit}`;
        }
    });
};
const generateCellColorValues = (store, x, y) => {
    return store.gameHistory.map((state) => state.grid[x][y].color);
};
const generateGhostPositions = (store, ghostIndex) => {
    return store.gameHistory.map((state) => {
        if (ghostIndex >= state.ghosts.length) {
            return '0,0'; // Default value for cases where the ghost does not exist
        }
        const ghost = state.ghosts[ghostIndex];
        const x = ghost.x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
        const y = ghost.y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + 15;
        return `${x},${y}`;
    });
};
const generateGhostsPredefinition = () => {
    let defs = `<defs>`;
    // For every regular ghost
    ['blinky', 'inky', 'pinky', 'clyde'].forEach((ghostName) => {
        // For each direction
        ['up', 'down', 'left', 'right'].forEach((direction) => {
            const ghostObj = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS[ghostName];
            if (direction in ghostObj) {
                defs += `
                <symbol id="ghost-${ghostName}-${direction}" viewBox="0 0 ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE} ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}">
                    <image href="${ghostObj[direction]}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}"/>
                </symbol>
                `;
            }
        });
    });
    // Add the scared ghost
    defs += `
    <symbol id="ghost-scared" viewBox="0 0 ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE} ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}">
        <image href="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS['scared'].imgDate}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}"/>
    </symbol>`;
    // Add ghost eyes (for each direction)
    ['up', 'down', 'left', 'right'].forEach((direction) => {
        if (_core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS['eyes'] && direction in _core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS['eyes']) {
            const eyesObj = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS['eyes'];
            defs += `
            <symbol id="ghost-eyes-${direction}" viewBox="0 0 ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE} ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}">
                <image href="${eyesObj[direction]}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}"/>
            </symbol>
            `;
        }
        else {
            // Fallback if direction is not set
            console.warn(`Imagem para eyes-${direction} não encontrada, usando placeholder`);
            defs += `
            <symbol id="ghost-eyes-${direction}" viewBox="0 0 ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE} ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}">
                <circle cx="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2}" cy="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2}" r="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 3}" fill="white"/>
            </symbol>
            `;
        }
    });
    defs += `</defs>`;
    return defs;
};
const generateChangingValuesAnimation = (store, changingValues) => {
    if (store.gameHistory.length !== changingValues.length) {
        throw new Error(`The amount of values (${changingValues.length}) does not match the size of the game history (${store.gameHistory.length})`);
    }
    const totalFrames = store.gameHistory.length;
    if (totalFrames === 0) {
        return { keyTimes: '0;1', values: changingValues[0] || '#000;#000' };
    }
    let keyTimes = [];
    let values = [];
    let lastValue = null;
    let lastIndex = null;
    changingValues.forEach((currentValue, index) => {
        if (currentValue !== lastValue) {
            if (lastValue !== null && lastIndex !== null && index - 1 !== lastIndex) {
                // Add a keyframe right before the value change
                keyTimes.push(Number(((index - 1 / (10 * SVG_KEY_TIMES_PRECISION)) / (totalFrames - 1)).toFixed(SVG_KEY_TIMES_PRECISION)));
                values.push(lastValue);
            }
            // Add the new value keyframe
            keyTimes.push(Number((index / (totalFrames - 1)).toFixed(SVG_KEY_TIMES_PRECISION)));
            values.push(currentValue);
            lastValue = currentValue;
            lastIndex = index;
        }
    });
    // Ensure the last frame is always included
    if (keyTimes.length === 0 || keyTimes[keyTimes.length - 1] !== 1) {
        // If there are no keyframes, add start and end frames
        if (keyTimes.length === 0) {
            keyTimes.push(0, 1);
            values.push(changingValues[0] || '#000', changingValues[changingValues.length - 1] || '#000');
        }
        else {
            keyTimes.push(1);
            values.push(lastValue || changingValues[changingValues.length - 1] || '#000');
        }
    }
    return {
        keyTimes: keyTimes.join(';'),
        values: values.join(';')
    };
};
const SVG = {
    generateAnimatedSVG
};


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PlayerStyle: () => (/* binding */ PlayerStyle)
/* harmony export */ });
var PlayerStyle;
(function (PlayerStyle) {
    PlayerStyle["CONSERVATIVE"] = "conservative";
    PlayerStyle["AGGRESSIVE"] = "aggressive";
    PlayerStyle["OPPORTUNISTIC"] = "opportunistic";
})(PlayerStyle || (PlayerStyle = {}));


/***/ }),

/***/ "./src/utils/grid.ts":
/*!***************************!*\
  !*** ./src/utils/grid.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Grid: () => (/* binding */ Grid)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/core/constants.ts");

const setSymmetricWall = (x, y, direction, sym, lineId) => {
    if (direction == 'horizontal') {
        (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, y, 'horizontal', lineId);
        if (sym == 'x') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x - 1, y, 'horizontal', lineId);
        }
        else if (sym == 'y') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y, 'horizontal', lineId);
        }
        else if (sym == 'xy') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x - 1, y, 'horizontal', lineId);
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y, 'horizontal', lineId);
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x - 1, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y, 'horizontal', lineId);
        }
    }
    else {
        (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, y, 'vertical', lineId);
        if (sym == 'x') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x, y, 'vertical', lineId);
        }
        else if (sym == 'y') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y - 1, 'vertical', lineId);
        }
        else if (sym == 'xy') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x, y, 'vertical', lineId);
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y - 1, 'vertical', lineId);
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y - 1, 'vertical', lineId);
        }
    }
};
const buildWalls = () => {
    setSymmetricWall(0, 2, 'horizontal', 'xy', 'L1');
    setSymmetricWall(1, 2, 'horizontal', 'xy', 'L1');
    //setSymmetricWall(4, 0, 'vertical', 'x', 'L2');
    setSymmetricWall(4, 1, 'vertical', 'x', 'L2');
    setSymmetricWall(4, 2, 'vertical', 'x', 'L2');
    setSymmetricWall(4, 3, 'vertical', 'x', 'L2');
    setSymmetricWall(4, 4, 'vertical', 'x', 'L2');
    setSymmetricWall(3, 3, 'horizontal', 'x', 'L3');
    setSymmetricWall(2, 3, 'horizontal', 'x', 'L3');
    setSymmetricWall(4, 5, 'horizontal', 'x', 'L4');
    setSymmetricWall(6, 4, 'vertical', 'x', 'L5');
    setSymmetricWall(6, 3, 'vertical', 'x', 'L5');
    setSymmetricWall(6, 2, 'vertical', 'x', 'L5');
    setSymmetricWall(6, 2, 'horizontal', 'x', 'L6');
    setSymmetricWall(7, 2, 'horizontal', 'x', 'L6');
    setSymmetricWall(8, 2, 'horizontal', 'x', 'L6');
    setSymmetricWall(9, 2, 'horizontal', 'x', 'L6');
    setSymmetricWall(13, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(14, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(15, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(16, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(17, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(18, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(16, 2, 'vertical', 'xy', 'L8');
    setSymmetricWall(8, 1, 'horizontal', 'x', 'L9');
    setSymmetricWall(9, 1, 'horizontal', 'x', 'L9');
    setSymmetricWall(10, 1, 'horizontal', 'x', 'L9');
    setSymmetricWall(11, 1, 'horizontal', 'x', 'L9');
    setSymmetricWall(12, 1, 'vertical', 'x', 'L10');
    setSymmetricWall(12, 3, 'vertical', 'x', 'L10');
    setSymmetricWall(11, 4, 'horizontal', 'x', 'L11');
    setSymmetricWall(10, 4, 'horizontal', 'x', 'L11');
    setSymmetricWall(9, 4, 'horizontal', 'x', 'L11');
    setSymmetricWall(8, 4, 'horizontal', 'x', 'L11');
    setSymmetricWall(8, 4, 'vertical', 'x', 'L12');
    setSymmetricWall(8, 5, 'vertical', 'x', 'L12');
    //setSymmetricWall(8, 6, 'vertical', 'x', 'L12');
    // setSymmetricWall(23, 2, 'horizontal', 'x', 'L13');
    // setSymmetricWall(24, 2, 'horizontal', 'x', 'L13');
    // setSymmetricWall(23, 4, 'horizontal', 'x', 'L13');
    // setSymmetricWall(24, 4, 'horizontal', 'x', 'L13');
    // setSymmetricWall(25, 4, 'horizontal', 'x', 'L13');
    // setSymmetricWall(23, 2, 'vertical', 'x', 'L14');
    // setSymmetricWall(23, 3, 'vertical', 'x', 'L14');
    // setSymmetricWall(26, 4, 'vertical', 'x', 'L15');
    // setSymmetricWall(26, 5, 'vertical', 'x', 'L15');
    // setSymmetricWall(23, 6, 'horizontal', 'x', 'L16');
    // setSymmetricWall(24, 6, 'horizontal', 'x', 'L16');
    // setSymmetricWall(25, 6, 'horizontal', 'x', 'L16');
    // setSymmetricWall(26, 0, 'vertical', 'x', 'L17');
    // setSymmetricWall(24, 1, 'vertical', 'x', 'L18');
    setSymmetricWall(23, 1, 'horizontal', 'x', 'L18');
    setSymmetricWall(22, 1, 'horizontal', 'x', 'L18');
    setSymmetricWall(21, 1, 'horizontal', 'x', 'L18');
    setSymmetricWall(21, 1, 'vertical', 'x', 'L18');
    setSymmetricWall(21, 2, 'vertical', 'x', 'L18');
    setSymmetricWall(21, 3, 'vertical', 'x', 'L18');
    setSymmetricWall(20, 4, 'horizontal', 'x', 'L18');
    setSymmetricWall(19, 4, 'horizontal', 'x', 'L18');
    setSymmetricWall(19, 3, 'vertical', 'x', 'L18');
    setSymmetricWall(18, 3, 'horizontal', 'x', 'L18');
    setSymmetricWall(22, 5, 'vertical', 'x', 'L19');
    setSymmetricWall(21, 5, 'horizontal', 'x', 'L19');
    setSymmetricWall(20, 5, 'horizontal', 'x', 'L19');
    setSymmetricWall(20, 5, 'vertical', 'x', 'L19');
    setSymmetricWall(1, 6, 'horizontal', 'x', 'L20');
    setSymmetricWall(2, 6, 'horizontal', 'x', 'L20');
    //setSymmetricWall(3, 5, 'vertical', 'x', 'L20');
    setSymmetricWall(3, 4, 'vertical', 'x', 'L20');
    setSymmetricWall(5, 6, 'horizontal', 'x', 'L21');
    setSymmetricWall(6, 6, 'horizontal', 'x', 'L21');
    // Ghost House
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(25, 2, 'horizontal', 'GH_TOP');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(27, 2, 'horizontal', 'GH_TOP');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(25, 4, 'horizontal', 'GH_BOTTOM');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(26, 4, 'horizontal', 'GH_BOTTOM');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(27, 4, 'horizontal', 'GH_BOTTOM');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(25, 3, 'vertical', 'GH_LEFT');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(28, 3, 'vertical', 'GH_RIGHT');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(25, 2, 'vertical', 'GH_LEFT');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(28, 2, 'vertical', 'GH_RIGHT');
};
const Grid = {
    buildWalls
};


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Utils: () => (/* binding */ Utils),
/* harmony export */   buildGrid: () => (/* binding */ buildGrid),
/* harmony export */   buildMonthLabels: () => (/* binding */ buildMonthLabels),
/* harmony export */   calculateContributionLevel: () => (/* binding */ calculateContributionLevel),
/* harmony export */   createGridFromData: () => (/* binding */ createGridFromData),
/* harmony export */   getCurrentTheme: () => (/* binding */ getCurrentTheme),
/* harmony export */   levelToIndex: () => (/* binding */ levelToIndex)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/core/constants.ts");

/* ─────────────────────────── Helpers ─────────────────────────── */
const weeksBetween = (start, end) => Math.floor((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
const truncateToUTCDate = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
/* ───────────────────────── Theme and helpers ────────────────────── */
const getCurrentTheme = (store) => { var _a; return (_a = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAME_THEMES[store.config.gameTheme]) !== null && _a !== void 0 ? _a : _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAME_THEMES['github']; };
const levelToIndex = (level) => {
    switch (level) {
        case 'NONE':
            return 0;
        case 'FIRST_QUARTILE':
            return 1;
        case 'SECOND_QUARTILE':
            return 2;
        case 'THIRD_QUARTILE':
            return 3;
        case 'FOURTH_QUARTILE':
            return 4;
        default:
            return 0;
    }
};
const calculateContributionLevel = (contribution, maxContribution) => {
    const q = maxContribution / 4;
    if (contribution === 0) {
        return 'NONE';
    }
    else if (contribution < q) {
        return 'FIRST_QUARTILE';
    }
    else if (contribution < 2 * q) {
        return 'SECOND_QUARTILE';
    }
    else if (contribution < 3 * q) {
        return 'THIRD_QUARTILE';
    }
    else {
        return 'FOURTH_QUARTILE';
    }
};
const buildGrid = (store) => {
    const endDate = truncateToUTCDate(new Date());
    const startDate = new Date(endDate);
    startDate.setUTCDate(endDate.getUTCDate() - 365);
    startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay());
    const realWidth = 53;
    const grid = Array.from({ length: realWidth }, () => Array.from({ length: _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT }, () => ({
        commitsCount: 0,
        color: getCurrentTheme(store).intensityColors[0],
        level: 'NONE'
    })));
    store.contributions.forEach((c) => {
        const date = truncateToUTCDate(new Date(c.date));
        if (date < startDate || date > endDate)
            return;
        const day = date.getUTCDay();
        const week = weeksBetween(startDate, date);
        if (week >= 0 && week < realWidth) {
            const theme = getCurrentTheme(store);
            grid[week][day] = {
                commitsCount: c.count,
                color: theme.intensityColors[levelToIndex(c.level)],
                level: c.level
            };
        }
    });
    store.grid = grid;
};
const buildMonthLabels = (store) => {
    const endDate = truncateToUTCDate(new Date());
    const startDate = new Date(endDate);
    startDate.setUTCDate(endDate.getUTCDate() - 365);
    startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay());
    const realWidth = weeksBetween(startDate, endDate) + 1;
    const labels = Array(realWidth).fill('');
    let lastMonth = '';
    for (let week = 0; week < realWidth; week++) {
        const date = new Date(startDate);
        date.setUTCDate(date.getUTCDate() + week * 7);
        const currentMonth = date.toLocaleString('default', { month: 'short' });
        // Only enter the name if it has changed month in relation to the last one
        if (currentMonth !== lastMonth) {
            labels[week] = currentMonth;
            lastMonth = currentMonth;
        }
    }
    store.monthLabels = realWidth > _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH ? labels.slice(realWidth - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH) : labels;
};
const createGridFromData = (store) => {
    buildGrid(store);
    return store.grid;
};
const Utils = {
    getCurrentTheme,
    buildGrid,
    buildMonthLabels,
    createGridFromData,
    levelToIndex
};


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PacmanRenderer: () => (/* binding */ PacmanRenderer)
/* harmony export */ });
/* harmony import */ var _core_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/game */ "./src/core/game.ts");
/* harmony import */ var _core_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/store */ "./src/core/store.ts");
/* harmony import */ var _providers_providers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./providers/providers */ "./src/providers/providers.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _utils_grid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/grid */ "./src/utils/grid.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/utils */ "./src/utils/utils.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






class PacmanRenderer {
    constructor(conf) {
        this.conf = Object.assign({}, conf);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultConfig = {
                platform: 'github',
                username: '',
                canvas: undefined,
                outputFormat: 'svg',
                svgCallback: (_) => { },
                gameOverCallback: () => { },
                gameTheme: 'github',
                gameSpeed: 1,
                enableSounds: false,
                pointsIncreasedCallback: (_) => { },
                githubSettings: { accessToken: '' },
                playerStyle: _types__WEBPACK_IMPORTED_MODULE_3__.PlayerStyle.OPPORTUNISTIC
            };
            // Reset the store on each call to start()
            this.store = JSON.parse(JSON.stringify(_core_store__WEBPACK_IMPORTED_MODULE_1__.Store));
            this.store.config = Object.assign(Object.assign({}, defaultConfig), this.conf);
            switch (this.store.config.platform) {
                case 'gitlab':
                    this.store.contributions = yield _providers_providers__WEBPACK_IMPORTED_MODULE_2__.Providers.fetchGitlabContributions(this.store);
                    break;
                case 'github':
                    this.store.contributions = yield _providers_providers__WEBPACK_IMPORTED_MODULE_2__.Providers.fetchGithubContributions(this.store);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${this.store.config.platform}`);
            }
            _utils_grid__WEBPACK_IMPORTED_MODULE_4__.Grid.buildWalls();
            _utils_utils__WEBPACK_IMPORTED_MODULE_5__.Utils.buildGrid(this.store);
            _utils_utils__WEBPACK_IMPORTED_MODULE_5__.Utils.buildMonthLabels(this.store);
            yield _core_game__WEBPACK_IMPORTED_MODULE_0__.Game.startGame(this.store);
            return this.store;
        });
    }
    stop() {
        _core_game__WEBPACK_IMPORTED_MODULE_0__.Game.stopGame(this.store);
    }
}

})();

var __webpack_exports__PacmanRenderer = __webpack_exports__.PacmanRenderer;
export { __webpack_exports__PacmanRenderer as PacmanRenderer };

//# sourceMappingURL=pacman-contribution-graph.js.map