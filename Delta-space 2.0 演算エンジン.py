import random

# 六角形の方向定義
DIR6 = [(1, -1, 0), (1, 0, -1), (0, 1, -1), (-1, 1, 0), (-1, 0, 1), (0, -1, 1)]

class DeltaAvoidanceEngine:
    def __init__(self, precision=12):
        self.precision = precision
        self.objects = {} # id -> (x, y, z)
        self.tree = {}    # Delta-tree

    def encode(self, pos):
        """座標を64bitキーに変換"""
        res = list(pos)
        key = 0
        for _ in range(self.precision):
            best_dir = max(range(6), key=lambda i: sum(res[j]*DIR6[i][j] for j in range(3)))
            mag = 1 if sum(res[j]*DIR6[best_dir][j] for j in range(3)) >= 0 else -1
            digit = (best_dir << 2) | (mag + 1)
            key = (key << 5) | (digit & 31)
            for j in range(3): res[j] -= mag * DIR6[best_dir][j]
        return key

    def update_tree(self):
        """全オブジェクトを木に再配置"""
        self.tree = {}
        for obj_id, pos in self.objects.items():
            key = self.encode(pos)
            node = self.tree
            for i in range(self.precision):
                d = (key >> (5 * (self.precision - 1 - i))) & 31
                if d not in node: node[d] = {}
                node = node[d]
            if 'ids' not in node: node['ids'] = []
            node['ids'].append(obj_id)

    def get_repulsion(self, my_id, my_pos, radius=4):
        """近隣個体からの『さける力』を計算"""
        repulsion = [0, 0, 0]
        # 本来はここでWavefront Searchを行うが、
        # プロトタイプとして全探索の代わりに木を利用して枝刈り
        for other_id, other_pos in self.objects.items():
            if my_id == other_id: continue
            
            # Delta-distance (L1) を計算
            dist = sum(abs(my_pos[i] - other_pos[i]) for i in range(3)) / 2
            if dist < radius and dist > 0:
                # 近いほど強く反発する
                for i in range(3):
                    repulsion[i] += (my_pos[i] - other_pos[i]) / dist
        return repulsion

# --- 1000個でのシミュレーションテスト ---
engine = DeltaAvoidanceEngine()
for i in range(1000):
    engine.objects[i] = (random.randint(-50, 50), random.randint(-50, 50), 0)

# 1ステップ更新
engine.update_tree()
first_id = 0
force = engine.get_repulsion(first_id, engine.objects[first_id])
print(f"個体{first_id}にかかる回避力: {force}")