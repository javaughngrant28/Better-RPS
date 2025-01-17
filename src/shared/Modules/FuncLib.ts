import { TweenService } from "@rbxts/services";

class FuncLib {
    static SetCollisionGroup(object: Instance, collisionGroupName: string): void {
        if (!object || !collisionGroupName) {
            warn("Invalid parameters passed to SetCollisionGroup");
            return;
        }

        for (const descendant of object.GetDescendants()) {
            if (descendant.IsA("BasePart")) {
                descendant.CollisionGroup = collisionGroupName;
            }
        }

        if (object.IsA("BasePart")) {
            object.CollisionGroup = collisionGroupName;
        }
    }

    static GetDistanceBetweenParts(part1: BasePart, part2: BasePart): number {
        if (!part1 || !part2) {
            throw "Both part1 and part2 must be valid BasePart instances.";
        }

        if (!part1.IsA("BasePart") || !part2.IsA("BasePart")) {
            throw "Part1 and Part2 must be a BasePart.";
        }

        return part1.Position.sub(part2.Position).Magnitude;
    }

    static SetAttributes(instance: Instance, list: Record<string, number | string | boolean>): void {
        if (!instance || !list) {
            warn("Invalid instance or list provided.");
            return;
        }

        for (const [key, value] of pairs(list)) {
            const [success, errorMessage] = pcall(() => instance.SetAttribute(key, value));
            if (!success) {
                warn(`Failed to set attribute '${key}': ${errorMessage}`);
            }
        }
    }

    static TweenCreate(
        timer: number,
        instance: Instance,
        value: Record<string, unknown>,
        EasingStyle: Enum.EasingStyle = Enum.EasingStyle.Linear,
        EasingDirection: Enum.EasingDirection = Enum.EasingDirection.Out,
        doesDestroy = true,
        callback?: () => void
    ): Tween {
        if (!instance) {
            warn("Caught tween instance as nil");
            throw "Instance cannot be nil";
        }

        const tweenInfo = new TweenInfo(timer, EasingStyle, EasingDirection);
        const tween = TweenService.Create(instance, tweenInfo, value);

        if (callback || doesDestroy) {
            tween.Completed.Connect((playbackState) => {
                if (playbackState === Enum.PlaybackState.Completed) {
                    if (callback) callback();
                    if (doesDestroy) tween.Destroy();
                }
            });
        }

        return tween;
    }

    static LoadAnimationTracks(
        animations: Array<Animation | Folder>,
        humanoid: Humanoid
    ): Record<string, AnimationTrack | Record<string, AnimationTrack>> {
        const animator = humanoid.FindFirstChildOfClass("Animator");
        if (!animator) throw "No Animator found in Humanoid.";

        const animationTracks: Record<string, AnimationTrack | Record<string, AnimationTrack>> = {};

        const load = (value: Animation) => {
            if (!value.IsA("Animation")) return;
            if (!value.AnimationId || value.AnimationId === "rbxassetid://") {
                warn(`Nil AnimationId for Animation: ${value.Name}`);
                return;
            }
            animationTracks[value.Name] = animator.LoadAnimation(value);
        };

        for (const value of animations) {
            if (value.IsA("Folder")) {
                const folderTracks: Record<string, AnimationTrack> = {};
                for (const animation of value.GetChildren()) {
                    if (animation.IsA("Animation")) {
                        folderTracks[animation.Name] = animator.LoadAnimation(animation);
                    }
                }
                animationTracks[value.Name] = folderTracks;
                continue;
            }

            if (value.IsA("Animation")) {
                load(value);
            }
        }

        return animationTracks;
    }

    static PlayAnimationForDuration(animationTrack: AnimationTrack, duration: number): void {
        if (!animationTrack) {
            warn("AnimationTrack is nil:", animationTrack);
            return;
        }
        const speed = animationTrack.Length / duration;
        animationTrack.Play();
        animationTrack.AdjustSpeed(speed);
    }

    static DisconnectAllConnections(connectionsTable: unknown): void {
        for (const [key, value] of pairs(connectionsTable as Record<string, unknown>)) {
            if (typeIs(value, "RBXScriptConnection")) {
                (value as RBXScriptConnection).Disconnect();
                (connectionsTable as Record<string, unknown>)[key] = undefined;
            } else if (typeIs(value, "table")) {
                this.DisconnectAllConnections(value);
            }
        }
    }

    static CloneSounds(sounds: Record<string, Sound | Array<Sound>>, targetFolder: Folder): void {
        const cloneSound = (sound: Sound, name: string, parentFolder: Folder) => {
            const newSound = sound.Clone();
            newSound.Name = name;
            newSound.Parent = parentFolder;
        };

        for (const [key, value] of pairs(sounds)) {
            if (typeIs(value, "Instance") && value.IsA("Sound")) {
                cloneSound(value, key, targetFolder);
            } else if (typeIs(value, "table")) {
                const newFolder = new Instance("Folder");
                newFolder.Name = key;
                newFolder.Parent = targetFolder;

                for (const sound of value as Array<Sound>) {
                    cloneSound(sound, sound.Name, newFolder);
                }
            }
        }
    }
}

export default FuncLib;
