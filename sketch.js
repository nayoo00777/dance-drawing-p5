let video;
let poseNet;
let poses = [];
let trails = {}; // 각 사람의 손 위치 추적용 (ID 기반)

function setup() {
  createCanvas(800, 600);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video, { detectionType: 'multi' }, modelReady);
  poseNet.on('pose', function (results) {
    poses = results;
  });

  background(255);
}

function modelReady() {
  console.log("PoseNet 로드 완료");
}

function draw() {
  fill(255, 10);
  rect(0, 0, width, height); // 잔상 효과

  for (let i = 0; i < poses.length; i++) {
    const pose = poses[i].pose;
    const id = poses[i].skeleton?.[0]?.[0]?.part + i || i;

    const hands = ["leftWrist", "rightWrist"];

    hands.forEach((hand) => {
      const kp = pose.keypoints.find(k => k.part === hand);
      if (kp && kp.score > 0.4) {
        const x = kp.position.x;
        const y = kp.position.y;

        if (!trails[id]) {
          trails[id] = {};
        }
        if (!trails[id][hand]) {
          trails[id][hand] = { px: x, py: y };
          return;
        }

        const prev = trails[id][hand];
        const dx = x - prev.px;
        const dy = y - prev.py;
        const speed = dist(x, y, prev.px, prev.py);

        const angle = atan2(dy, dx);
        const hue = degrees(angle) % 360;

        strokeWeight(map(speed, 0, 50, 1, 20, true));
        stroke(color(`hsla(${hue}, 80%, 60%, 0.8)`));
        line(prev.px, prev.py, x, y);

        trails[id][hand] = { px: x, py: y };
      }
    });
  }
}
