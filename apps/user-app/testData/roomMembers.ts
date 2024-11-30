export interface RoomMember {
  username: string;
  status: "online" | "offline";
  id: string;
}

export const MEMBERS: RoomMember[] = [
  { id: "1", username: "member1", status: "offline" },
  { id: "2", username: "skywalker87", status: "online" },
  { id: "3", username: "codeNinja", status: "online" },
  { id: "4", username: "techPro", status: "online" },
  { id: "5", username: "gamemaster", status: "offline" },
  { id: "6", username: "musicLover", status: "online" },
  { id: "7", username: "wanderer", status: "offline" },
  { id: "8", username: "bookworm42", status: "offline" },
  { id: "9", username: "starGazer", status: "online" },
  { id: "10", username: "digitalNomad", status: "online" },
  { id: "11", username: "quantumLeap", status: "online" },
  { id: "12", username: "artisan_coder", status: "offline" },
  { id: "13", username: "adventureSeeker", status: "online" },
  { id: "14", username: "moonlightShadow", status: "offline" },
  { id: "15", username: "cryptoTrader", status: "online" },
  { id: "16", username: "virtualNomad", status: "offline" },
  { id: "17", username: "urbanExplorer", status: "online" },
  { id: "18", username: "mindfulTech", status: "offline" },
  { id: "19", username: "ecoWarrior", status: "online" },
  { id: "20", username: "globalNomad", status: "offline" },
  { id: "21", username: "pixelPioneer", status: "online" },
  { id: "22", username: "zenCoder", status: "offline" },
  { id: "23", username: "creativeSoul", status: "online" },
  { id: "24", username: "dataWizard", status: "offline" },
  { id: "25", username: "stealthMode", status: "online" },
  { id: "26", username: "innovationHub", status: "offline" },
  { id: "27", username: "travelBug", status: "online" },
  { id: "28", username: "mindfullMaven", status: "offline" },
  { id: "29", username: "techEnthusiast", status: "online" },
  { id: "30", username: "modernNomad", status: "offline" },
];
