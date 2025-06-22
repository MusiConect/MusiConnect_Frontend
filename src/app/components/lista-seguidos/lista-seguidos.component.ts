import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowService } from '../../services/follow.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-lista-seguidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-seguidos.component.html',
  styleUrls: ['./lista-seguidos.component.css']
})
export class ListaSeguidosComponent implements OnInit {
  seguidos: any[] = [];
  cargando = true;

  constructor(
    private followService: FollowService,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    const miId = this.session.getUserId();
    if (!miId) return;
    this.followService.getFollowing(miId).subscribe({
      next: (data) => {
        this.seguidos = data;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  dejarDeSeguirUsuario(user: any): void {
    const miId = this.session.getUserId();
    if (!miId || !user.userId) return;
    this.followService.unfollowUser(miId, user.userId).subscribe({
      next: () => {
        this.seguidos = this.seguidos.filter(u => u.userId !== user.userId);
      }
    });
  }
}