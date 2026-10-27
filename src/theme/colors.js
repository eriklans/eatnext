// Appens färger, samlade på ett ställe så att de är lätta att ändra
export const colors = {
    primary: "#2E7D5B",
    background: "#F7F7F2",
    surface: "#FFFFFF",
    text: "#1E2420",
    textMuted: "#5B625D",
    error: "#B42318",

    // Statusfärger: mörk text på ljus bakgrund i samma färgton, för god läsbarhet
    status: {
        expired: { text: "#B42318", background: "#FDECEC" },
        today: { text: "#B42318", background: "#FDECEC" },
        soon: { text: "#9A4A0B", background: "#FDF1E6" },
        fresh: { text: "#1F5C42", background: "#E8F3EE" },
    },
};