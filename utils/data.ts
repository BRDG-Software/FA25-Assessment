import { questionsTypes, shoeEnum } from "./types";

export const SLIP_COUNT_KEY = "slip_count";

export const questions: questionsTypes[] = [
  {
    id: "q1",
    text: "Your ideal running weather is…",
    options: [
      {
        label: "A / Light fog—like running through a dream",
        shoe: shoeEnum.pegasus,
      },
      {
        label: "B / Sunny with a breeze - let's go fast",
        shoe: shoeEnum.vomero,
      },
      {
        label: "C / Crisp and cool—perfect for focus",
        shoe: shoeEnum.structure,
      },
    ],
  },
  {
    id: "q2",
    text: "WHAT’S YOUR IDEAL RUNNING COMPANION?",
    options: [
      {
        label: "A / A hype friend to push limits",
        shoe: shoeEnum.pegasus,
      },
      {
        label: "B / Music and the sound of your breath",
        shoe: shoeEnum.vomero,
      },
      {
        label: "C / A coach for focus",
        shoe: shoeEnum.structure,
      },
    ],
  },
  {
    id: "q3",
    text: "How do you want your stride to feel?",
    options: [
      {
        label: "A / Electric and energized",
        shoe: shoeEnum.pegasus,
      },
      {
        label: "B / Plush and effortless",
        shoe: shoeEnum.vomero,
      },
      {
        label: "C / Gears clicking into place",
        shoe: shoeEnum.structure,
      },
    ],
  },
  {
    id: "q4",
    text: "If your run had a color palette, it would be…",
    options: [
      {
        label: "A / Neon pops—bold and electric",
        shoe: shoeEnum.pegasus,
      },
      {
        label: "B / Soft gradients—calm and dreamy",
        shoe: shoeEnum.vomero,
      },
      {
        label: "C / Earth tones—grounded and reliable",
        shoe: shoeEnum.structure,
      },
    ],
  },
  {
    id: "q5",
    text: "When you imagine your perfect run, it feels like...",
    options: [
      {
        label: "A / A surge of energy that launches you forward",
        shoe: shoeEnum.pegasus,
      },
      {
        label: "B / A soft glide that makes the miles melt away",
        shoe: shoeEnum.vomero,
      },
      {
        label: "C / A smooth, rhythmic flow that locks you in",
        shoe: shoeEnum.structure,
      },
    ],
  },
];

export const calibrationSteps: string[] = [
  "CALIBRATION IN PROGRESS",
  "CALCULATING WEATHER PREFERENCES",
  "assessing Run companion compatibility",
  "analyzing stride",
  "optimizing STRIDE LENGTH",
  "SYNCHRONIZING BREATHING PATTERN",
  "EVALUATING run flow",
  "gauging ENERGY OUTPUT",
  "reading color palette hues",
  "RETRIEVING ENDURANCE DATA",
  "generating perfect run",
];

export const runSteps = {
  [shoeEnum.pegasus]: "RUN IN PEGASUS",
  [shoeEnum.vomero]: "RUN IN VOMERO",
  [shoeEnum.structure]: "RUN IN STRUCTURE",
};

export const structureVideos: string[] = [
  "/assets/StructureMotionCopy/8be24e91b2ee18679c8aea7d69ef52a81a20c46c.mp4",

  "/assets/StructureMotionCopy/888b0e6dba352f45b60a0ed97504983b1e2c2593.mp4",

  "/assets/StructureMotionCopy/c666d8bd10cf3aae74b5aed73ace44b76f2f1676.mp4",

  "/assets/StructureMotionCopy/FOOTSTRIKE_STRUCTURE_02.mp4",

  "/assets/StructureMotionCopy/STRUCTURE_TOY_010001-0300.mp4",
];

export const pegasusVideos: string[] = [
  "/assets/PegMotionCopy/663a1b07dad7a711ba8de9df9b200ee92c81e25a.mp4",
  "/assets/PegMotionCopy/7782ddd3bcaa3cbcaeba9bbe237c5a4ccd5798de.mp4",
  "/assets/PegMotionCopy/a372d0c5251240227ee29c3c473464c94513107e.mp4",
  "/assets/PegMotionCopy/af821a464be4c62e9838554d7e3bd2e0d4fcc8fd.mp4",
  "/assets/PegMotionCopy/FOOTSTRIKE_PEGASUS_02.mp4",
];

export const vomeroVideos: string[] = [
  "/assets/VomeroMotionCopy/3d8d4c5d1ae1597f662c73d6eca4eccb3f41c993.mp4",
  "/assets/VomeroMotionCopy/0360592e96a92fdeeee343ce48b5c36ab90858a9.mp4",
  "/assets/VomeroMotionCopy/c55552b8d16e5cdf249559f2ca37ef2f162cbe3e.mp4",
  "/assets/VomeroMotionCopy/DATA_TEST_030001-0110.mp4",
  "/assets/VomeroMotionCopy/FOOTSTRIKE_VOMERO_01.mp4",
];
